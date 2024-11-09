import RTCManager from "../../lib/rtc-manager";
import { ConnectionState } from "../../lib/types";

export type ChatProperties = {
  connectionState: ConnectionState;
  matchingInterests: string[];
  onMessage?: () => void;
  rtcManager?: RTCManager;
};

export type LocalMessage = {
  text: string;
  timestamp: number;
  type: "received" | "sent" | "system";
};
