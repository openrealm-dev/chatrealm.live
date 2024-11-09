import { NoMatchFoundError } from "../errors";
import RTCManager from "./rtc-manager";
import { ChatType, S2CAnswerRequest } from "./types";
import WSManager from "./ws-manager";

export type Payload = {
  interests: string[];
  url: string;
};

export type ConnectionResult = {
  matchedInterests: string[];
  rtcManager: RTCManager;
};

// Handles an incoming answer request
export const handleAnswerRequest = async (
  request: S2CAnswerRequest,
  wsManager: WSManager,
  rtcManager: RTCManager,
) => {
  const answer = await rtcManager.getAnswer(request.offer);
  wsManager.sendAnswer(answer);
};

/**
 * Initializes WebSocket and RTC connection.
 */
export const initConnectionAndFetchDataChannel = async (
  payload: Payload,
  chatType: ChatType,
  mediaStream?: MediaStream,
): Promise<ConnectionResult> => {
  const { interests, url } = payload;
  const wsManager = new WSManager(url);
  const rtcManager = new RTCManager();
  let matchedInterests: string[] = [];

  try {
    await wsManager.waitToConnect();

    if (chatType === ChatType.VIDEO && mediaStream) {
      for (const track of mediaStream.getTracks()) {
        rtcManager.addTrack(track, mediaStream);
      }
    }

    const offer = await rtcManager.getOffer();
    wsManager.init(offer, chatType, interests);

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      rtcManager.on("ICECANDIDATE", (candidate) =>
        wsManager.sendCandidate(candidate),
      );

      wsManager
        .on("S2CANSWERREQUEST", (data) => {
          matchedInterests = data.matchedInterests;
          handleAnswerRequest(data, wsManager, rtcManager);
        })
        .on("S2COFFER", (data) => {
          matchedInterests = data.matchedInterests;
          rtcManager.setAnswer(data.offer);
        })
        .on("S2CICECANDIDATE", (data) =>
          rtcManager.addIceCandidate(data.candidate),
        )
        .on("timeout", () => reject(new NoMatchFoundError()));

      await rtcManager.waitForRtcConnection()?.catch(reject);
      wsManager.destroy();
      resolve({ matchedInterests, rtcManager });
    });
  } catch (error) {
    wsManager.destroy();
    throw error;
  }
};
