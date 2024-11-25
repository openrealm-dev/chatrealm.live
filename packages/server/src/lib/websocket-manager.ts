import EventEmitter from "node:events";
import WebSocket from "ws";

import { C2SAnswerMessage, C2SMessage, S2CMessage } from "../types.js";

/**
 * Manages WebSocket connections and handles communication.
 * @extends EventEmitter
 */
// eslint-disable-next-line unicorn/prefer-event-target
class WebSocketManager extends EventEmitter {
  private timeoutId: NodeJS.Timeout;
  private ws: WebSocket;

  /**
   * Creates an instance of WebSocketManager.
   * @param {WebSocket} ws - The WebSocket connection to manage.
   */
  public constructor(ws: WebSocket) {
    super();

    this.ws = ws;
    this.ws.addEventListener("close", () => this.emit("close"));

    this.timeoutId = setTimeout(() => this.handleTimeout(), 20_000);
  }

  /**
   * Destroys the WebSocket connection and cleans up resources.
   */
  public destroy() {
    clearTimeout(this.timeoutId);
    this.ws.close();
  }

  /**
   * Registers a callback to handle ICE candidate messages.
   * @param {function(string): void} callback - The callback to handle ICE candidates.
   */
  public onIceCandidate(callback: (candidate: string) => void) {
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data.toString()) as C2SMessage;
      if (message.type === "C2SICECANDIDATE") {
        callback(message.candidate);
      }
    });
  }

  /**
   * Sends an offer and waits for an answer.
   * @param {string} offer - The offer to send.
   * @param {string[]} matchedInterests - The matched interests.
   * @returns {Promise<string>} - A promise that resolves with the answer.
   */
  public async requestAndWaitForAnswer(
    offer: string,
    matchedInterests: string[],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const localTimeout = setTimeout(reject, 10_000);

      this.ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data.toString()) as C2SAnswerMessage;
        if (message.type === "C2SANSWER") {
          clearTimeout(localTimeout);
          resolve(message.answer);
        }
      });

      this.sendResponse({ matchedInterests, offer, type: "S2CANSWERREQUEST" });
    });
  }

  /**
   * Sends a peer answer.
   * @param {string} answer - The answer to send.
   * @param {string[]} matchedInterests - The matched interests.
   */
  public sendPeerAnswer(answer: string, matchedInterests: string[]) {
    this.sendResponse({ matchedInterests, offer: answer, type: "S2COFFER" });
  }

  /**
   * Sends a peer ICE candidate.
   * @param {string} candidate - The ICE candidate to send.
   */
  public sendPeerIceCandidate(candidate: string) {
    this.sendResponse({ candidate, type: "S2CICECANDIDATE" });
  }

  /**
   * Handles the timeout event.
   * @private
   */
  private handleTimeout() {
    this.sendResponse({ type: "timeout" });
    this.destroy();
  }

  /**
   * Sends a response message.
   * @param {S2CMessage} message - The message to send.
   * @private
   */
  private sendResponse(message: S2CMessage) {
    this.ws.send(JSON.stringify(message));
  }
}

export default WebSocketManager;
