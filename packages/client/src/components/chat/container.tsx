import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  Match,
  on,
  onCleanup,
  Switch,
} from "solid-js";

import {
  ConnectionResult,
  initConnectionAndFetchDataChannel,
} from "../../lib/connection-utils";
import { destroyStream, getStream } from "../../lib/stream";
import { ChatType, ConnectionState } from "../../lib/types";
import ConnectionIndicator from "../connection-indicator";
import ConnectionScreen from "../connection-screen";
import TextChat from "./text-chat";
import VideoChat from "./video-chat";

/**
 * ChatContainer component manages chat connections and renders the appropriate UI based on connection status.
 */
const ChatContainer: Component<{ chatType: ChatType; interests: string[] }> = (
  properties,
) => {
  const url = "/ws";

  const [result, setResult] = createSignal<ConnectionResult>();
  const [connectionState, setConnectionState] = createSignal<ConnectionState>(
    ConnectionState.Connecting,
  );

  /**
   * Disconnect handler for the RTC connection.
   */
  const handleDisconnect = () => {
    result()?.rtcManager?.destroy();
    setConnectionState(ConnectionState.Disconnected);
  };

  /**
   * Initiates connection and updates the state based on connection status.
   */
  const connectAndUpdateState = async () => {
    setConnectionState(ConnectionState.Connecting);

    try {
      const connectionResult = await initConnectionAndFetchDataChannel(
        { interests: properties.interests, url },
        properties.chatType,
        getStream(),
      );

      connectionResult.rtcManager.once("closed", handleDisconnect);
      setResult(connectionResult);
      setConnectionState(ConnectionState.Connected);
    } catch (error) {
      setConnectionState(
        (error as Error).name === "NoMatchFoundError"
          ? ConnectionState.NoMatchFound
          : ConnectionState.Error,
      );
    }
  };

  // Reconnects on interest changes
  createEffect(on(() => properties.interests, connectAndUpdateState));

  // Cleans up RTC connection on component unmount
  onCleanup(() => result()?.rtcManager.destroy());

  // Determines if connection screen should be displayed
  const showConnectionScreen = createMemo(() =>
    [
      ConnectionState.Connecting,
      ConnectionState.Error,
      ConnectionState.NoMatchFound,
    ].includes(connectionState()),
  );

  onCleanup(() => destroyStream());

  return (
    <div class="h-full flex flex-col overflow-hidden relative">
      <Switch>
        <Match when={showConnectionScreen()}>
          <ConnectionScreen
            handleRetry={connectAndUpdateState}
            state={connectionState()}
            stream={getStream()}
          />
        </Match>
        <Match when={!showConnectionScreen()}>
          <div class="bg-base-200 border-b border-base-300 text-sm">
            <div class="p-2">
              <ConnectionIndicator
                handleDisconnect={handleDisconnect}
                handleRetry={connectAndUpdateState}
                state={connectionState()}
              />
            </div>
          </div>
          <div class="flex-1 min-h-0 p-2 lg:p-4">
            <Switch>
              <Match when={properties.chatType === ChatType.TEXT}>
                <TextChat
                  connectionState={connectionState()}
                  matchingInterests={result()?.matchedInterests || []}
                  rtcManager={result()?.rtcManager}
                />
              </Match>
              <Match when={properties.chatType === ChatType.VIDEO}>
                <VideoChat
                  connectionState={connectionState()}
                  matchingInterests={result()?.matchedInterests || []}
                  rtcManager={result()?.rtcManager}
                />
              </Match>
            </Switch>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default ChatContainer;
