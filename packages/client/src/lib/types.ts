export enum ConnectionState {
  Connected = "connected",
  Connecting = "connecting",
  Disconnected = "disconnected",
  Error = "error",
  NoMatchFound = "no-mathch-found",
}

export interface C2SInit {
  chatType: ChatType;
  interests: string[];
  sdp: RTCSessionDescriptionInit;
  type: "C2SINIT";
}

export interface C2SAnswer {
  answer: RTCSessionDescriptionInit;
  type: "C2SANSWER";
}

export interface S2COffer {
  matchedInterests: string[];
  offer: RTCSessionDescriptionInit;
  type: "S2COFFER";
}

export interface S2CAnswerRequest {
  matchedInterests: string[];
  offer: RTCSessionDescriptionInit;
  type: "S2CANSWERREQUEST";
}

export interface S2CTimeout {
  type: "timeout";
}

export interface C2SIceCandidate {
  candidate: RTCIceCandidate;
  type: "C2SICECANDIDATE";
}

export interface S2CIceCandidate {
  candidate: RTCIceCandidate;
  type: "S2CICECANDIDATE";
}

export type S2CMessage =
  | S2CAnswerRequest
  | S2CIceCandidate
  | S2COffer
  | S2CTimeout;

export type C2SMessage = C2SAnswer | C2SIceCandidate | C2SInit;

export type DataTextMessage = {
  payload: {
    id: number;
    message: string;
  };
  type: "message";
};

export type DataTypingMessage = {
  type: "typing";
};

export type DataSeenMessage = {
  payload: { id: number };
  type: "seen";
};

export type DataMessage = DataSeenMessage | DataTextMessage | DataTypingMessage;

export enum ChatType {
  TEXT = "text",
  VIDEO = "video",
}
