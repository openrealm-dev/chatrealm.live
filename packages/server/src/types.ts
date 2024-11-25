import WebSocketManager from "./lib/websocket-manager.js";

export enum ChatType {
  TEXT = "text",
  VIDEO = "video",
}

export interface C2SAnswerMessage {
  answer: string;
  type: "C2SANSWER";
}

export interface C2SIceCandidateMessage {
  candidate: string;
  type: "C2SICECANDIDATE";
}

export interface C2SInitMessage {
  chatType: ChatType;
  interests: string[];
  sdp: string;
  type: "C2SINIT";
}

export type C2SMessage =
  | C2SAnswerMessage
  | C2SIceCandidateMessage
  | C2SInitMessage;

export interface MatchResult {
  matchedInterests: string[];
  peer: User;
}

export interface S2CAnswerRequestMessage {
  matchedInterests: string[];
  offer: string;
  type: "S2CANSWERREQUEST";
}

export interface S2CIceCandidateMessage {
  candidate: string;
  type: "S2CICECANDIDATE";
}

export type S2CMessage =
  | S2CAnswerRequestMessage
  | S2CIceCandidateMessage
  | S2COfferMessage
  | S2CTimeoutMessage;

export interface S2COfferMessage {
  matchedInterests: string[];
  offer: string;
  type: "S2COFFER";
}

export interface S2CTimeoutMessage {
  type: "timeout";
}

export interface User {
  chatType: ChatType;
  id: string;
  interests: string[];
  recentMatches: Set<string>;
  sdp: string;
  ws: WebSocketManager;
}
