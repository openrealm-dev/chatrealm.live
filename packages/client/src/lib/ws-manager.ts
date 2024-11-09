import EventEmitter from "eventemitter3";

import { C2SMessage, ChatType, S2CMessage } from "./types";

/**
 * Manages WebSocket connections for real-time communication.
 * Extends EventEmitter to emit custom events for WebSocket messages.
 */
class WSManager extends EventEmitter {
  private ws: WebSocket;

  /**
   * Initializes the WebSocket connection and sets up event listeners.
   * @param url - The WebSocket server URL.
   */
  public constructor(url: string) {
    super();
    this.ws = new WebSocket(url);

    // Bind methods for consistency
    this.handleMessage = this.handleMessage.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);

    // Set up WebSocket event listeners
    this.ws.addEventListener("close", () => this.emit("CLOSED"));
    this.ws.addEventListener("message", this.handleMessage);
  }

  /**
   * Handles incoming WebSocket messages and emits them based on their type.
   * @param event - WebSocket message event.
   */
  private handleMessage(event: MessageEvent<string>) {
    const { type, ...data } = JSON.parse(event.data) as S2CMessage;
    this.emit(type, data);
  }

  /**
   * Closes the WebSocket connection.
   */
  public destroy() {
    this.ws.close();
  }

  /**
   * Initiates a connection setup by sending an offer and user interests.
   * @param offer - The SDP offer for establishing the WebRTC connection.
   * @param interests - Array of user interests for matching.
   */
  public init(
    offer: RTCSessionDescriptionInit,
    chatType: ChatType,
    interests: string[],
  ) {
    this.sendMessage({ chatType, interests, sdp: offer, type: "C2SINIT" });
  }

  /**
   * Sends an SDP answer in response to a received offer.
   * @param answer - The SDP answer for WebRTC setup.
   */
  public sendAnswer(answer: RTCSessionDescriptionInit) {
    this.sendMessage({ answer, type: "C2SANSWER" });
  }

  /**
   * Sends a new ICE candidate for WebRTC peer connection.
   * @param candidate - The ICE candidate to be sent.
   */
  public sendCandidate(candidate: RTCIceCandidate) {
    this.sendMessage({ candidate, type: "C2SICECANDIDATE" });
  }

  /**
   * Sends a message over the WebSocket connection.
   * @param message - The message to send, adhering to the C2SMessage structure.
   */
  public sendMessage(message: C2SMessage) {
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Waits for the WebSocket connection to open, with a timeout.
   * @returns A promise that resolves when the connection opens or rejects if it fails.
   */
  public waitToConnect(): Promise<void> {
    if (this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout: Unable to connect to WebSocket"));
      }, 10_000);

      this.ws.addEventListener("open", () => {
        clearTimeout(timeout);
        resolve();
      });

      this.ws.addEventListener("error", () => {
        clearTimeout(timeout);
        reject(new Error("WebSocket error: Unable to connect"));
      });

      this.ws.addEventListener("close", () => {
        clearTimeout(timeout);
        reject(new Error("WebSocket closed unexpectedly"));
      });
    });
  }
}

export default WSManager;
