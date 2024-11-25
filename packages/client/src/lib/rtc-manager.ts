import EventEmitter from "eventemitter3";

import { NoMatchFoundError, NoStreamError } from "../errors";
import { DataSeenMessage, DataTextMessage } from "./types";

// ICE server configuration for STUN/TURN servers
const iceConfig: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302"] },
    { urls: ["stun:www.chatrealm.live:3478"] },
    {
      credential: "hinataLovesNarut0",
      urls: [
        "turn:www.chatrealm.live:3478?transport=udp",
        "turn:www.chatrealm.live:3478?transport=tcp",
        "turns:www.chatrealm.live:5349",
      ],
      username: "naruto",
    },
  ],
};

class RTCManager extends EventEmitter {
  private channel: RTCDataChannel;
  private localOffer: RTCSessionDescriptionInit | undefined;
  private pc: RTCPeerConnection;
  private peerMediaStream: MediaStream | undefined;
  private remoteChannel: RTCDataChannel | undefined;

  public constructor() {
    super();
    this.pc = new RTCPeerConnection(iceConfig);
    this.channel = this.pc.createDataChannel("messages", { ordered: true });
    this.setupEventListeners();
  }

  /**
   * Adds an ICE candidate to the peer connection.
   */
  public addIceCandidate(candidate: RTCIceCandidateInit) {
    this.pc.addIceCandidate(candidate);
  }

  /**
   * Adds a track to the peer connection.
   */
  public addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.pc.addTrack(track, stream);
  }

  /**
   * Closes and cleans up the peer connection and channels.
   */
  public destroy() {
    this.remoteChannel?.close();
    this.channel.close();
    this.pc.close();
  }

  /**
   * Sets the remote offer and returns an answer for peer connection.
   */
  public async getAnswer(
    offer: RTCSessionDescriptionInit,
  ): Promise<RTCSessionDescriptionInit> {
    await this.pc.setRemoteDescription(offer);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  /**
   * Creates and returns an offer for peer connection.
   */
  public async getOffer(): Promise<RTCSessionDescriptionInit> {
    this.localOffer = await this.pc.createOffer();
    return this.localOffer;
  }

  /**
   * Returns the current remote stream if available.
   */
  public getRemoteStream(): MediaStream | undefined {
    return this.peerMediaStream;
  }

  /**
   * Notifies the other user that the current user is typing.
   */
  public informUserTyping() {
    this.channel.send(JSON.stringify({ type: "typing" }));
  }

  /**
   * Sends a text message over the data channel.
   */
  public sendMessage(message: string): number {
    const id = Date.now();
    this.channel.send(
      JSON.stringify({
        payload: { id, message },
        type: "message",
      } as DataTextMessage),
    );
    return id;
  }

  /**
   * Sends a "seen" acknowledgement for a given message ID.
   */
  public sendSeenAcknowledgement(id: number) {
    this.channel.send(
      JSON.stringify({ payload: { id }, type: "seen" } as DataSeenMessage),
    );
  }

  /**
   * Sets the remote answer to finalize the connection.
   */
  public setAnswer(answer: RTCSessionDescriptionInit) {
    if (this.localOffer) this.pc.setLocalDescription(this.localOffer);
    this.pc.setRemoteDescription(answer);
  }

  /**
   * Waits for the remote stream to become available, or rejects if it times out.
   */
  public async waitForRemoteStream(): Promise<MediaStream> {
    if (this.peerMediaStream) return this.peerMediaStream;

    return new Promise<MediaStream>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new NoStreamError()), 10_000);
      this.pc.addEventListener("track", () => {
        clearTimeout(timeout);
        resolve(this.peerMediaStream!);
      });
    });
  }

  /**
   * Waits until the RTC connection is established, or rejects if it times out.
   */
  public waitForRtcConnection(): Promise<void> {
    if (this.pc.connectionState === "connected") return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new NoMatchFoundError()), 20_000);
      this.pc.addEventListener("connectionstatechange", () => {
        if (this.pc.connectionState === "connected") {
          clearTimeout(timeout);
          resolve();
        }
      });
    });
  }

  /**
   * Initializes the remote data channel and sets up message handling.
   */
  private initializeRemoteChannel(channel: RTCDataChannel) {
    this.remoteChannel = channel;
    channel.addEventListener("message", (event) =>
      this.emit("data-message", event.data),
    );
    channel.addEventListener("close", () => this.emit("closed"));
  }

  /**
   * Sets up event listeners for PeerConnection and DataChannel.
   */
  private setupEventListeners() {
    this.channel.addEventListener("close", () => this.emit("closed"));

    this.pc.addEventListener("connectionstatechange", () => {
      if (this.pc.connectionState === "closed") this.emit("closed");
    });

    this.pc.addEventListener("datachannel", (event) =>
      this.initializeRemoteChannel(event.channel),
    );

    this.pc.addEventListener("track", (event_) => {
      const [stream] = event_.streams;
      this.peerMediaStream = stream;
    });

    this.pc.addEventListener("icecandidate", (event) =>
      this.emit("ICECANDIDATE", event.candidate),
    );
  }
}

export default RTCManager;
