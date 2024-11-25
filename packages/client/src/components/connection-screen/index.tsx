import { Component, ComponentProps, JSX, Match, Show, Switch } from "solid-js";
import RetryIcon from "~icons/heroicons/arrow-path-solid";
import NoMatchIcon from "~icons/heroicons/chat-bubble-left-ellipsis-20-solid";
import ErrorIcon from "~icons/heroicons/exclamation-triangle-20-solid";

import { ConnectionState } from "../../lib/types";
import AmbientVideo from "../ambient-video";
import styles from "./styles.module.css";

type ConnectionMessageProperties = {
  icon: (properties: ComponentProps<"svg">) => JSX.Element;
  iconColor?: string;
  message: string;
  onRetry?: () => void;
  showRetry: boolean;
  title: string;
};

const ConnectionMessage: Component<ConnectionMessageProperties> = (
  properties,
) => (
  <div class="text-center flex flex-col items-center justify-center gap-2 bg-base-200 border border-base-300 rounded-lg p-4 md:p-8 shadow-xl">
    <properties.icon class={`w-16 h-16 ${properties.iconColor ?? ""}`} />
    <p class="text-lg md:text-2xl font-bold">{properties.title}</p>
    <p class="md:text-lg">{properties.message}</p>
    <Show when={properties.showRetry}>
      <button
        class="btn btn-primary"
        onClick={() => properties.onRetry?.()}
        title="Retry"
      >
        <RetryIcon />
        Retry
      </button>
    </Show>
  </div>
);

const ConnectionScreen: Component<{
  handleRetry: () => void;
  state: ConnectionState;
  stream?: MediaStream | null;
}> = (properties) => {
  return (
    <div
      class={`flex justify-center items-start p-2 md:pt-16 md:h-full w-full ${styles.main} overflow-auto flex-1`}
    >
      <div class="flex flex-col items-center justify-center gap-2 md:gap-4">
        <Show when={properties.stream}>
          <AmbientVideo
            class="w-full h-96 md:h-auto md:w-96 overflow-hidden border border-base-300 bg-black rounded-lg"
            mediaStream={properties.stream}
            muted
          />
        </Show>
        <Switch>
          <Match when={properties.state === ConnectionState.Connecting}>
            <ConnectionMessage
              icon={() => <div class={styles.loader} />}
              message="Please hold on for a moment. Your conversation will start soon!"
              showRetry={false}
              title="Connecting you to a chat partner..."
            />
          </Match>
          <Match when={properties.state === ConnectionState.Error}>
            <ConnectionMessage
              icon={ErrorIcon}
              iconColor="text-warning"
              message="Please check your network and try again in a moment."
              onRetry={properties.handleRetry}
              showRetry={true}
              title="Oops! There was an issue connecting you to a chat partner."
            />
          </Match>
          <Match
            when={properties.state === ConnectionState.NoMatchFound || true}
          >
            <ConnectionMessage
              icon={NoMatchIcon}
              iconColor="text-accent"
              message="Please wait a moment, or try again soon - we'll connect you to a chat partner as soon as possible!"
              onRetry={properties.handleRetry}
              showRetry={true}
              title="Looks like no one's available right now."
            />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default ConnectionScreen;
