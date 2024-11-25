import { Component, Match, Switch } from "solid-js";
import RetryIcon from "~icons/material-symbols/refresh";
import IconPointFilled from "~icons/radix-icons/dot-filled";

import { ConnectionState } from "../../lib/types";

const ConnectionIndicator: Component<{
  handleDisconnect: () => void;
  handleRetry: () => void;
  state: ConnectionState;
}> = (properties) => {
  return (
    <Switch>
      <Match when={properties.state === ConnectionState.Connected}>
        <div class="flex items-center justify-between">
          <p class="font-semibold">Connected</p>
          <div class="flex items-center gap-1">
            <button
              class="btn btn-error btn-xs"
              onClick={() => properties.handleDisconnect()}
              title="Disconnect"
            >
              Disconnect
            </button>
            <IconPointFilled class="text-green-600" />
          </div>
        </div>
      </Match>
      <Match when={properties.state === ConnectionState.Connecting}>
        <div class="flex items-center justify-between">
          <p class="font-semibold">Connecting</p>
          <span class="loading loading-dots loading-xs" />
        </div>
      </Match>
      <Match when={properties.state === ConnectionState.Error}>
        <div class="flex items-center justify-between">
          <p class="font-semibold">Oops! Something went wrong</p>
          <div class="flex items-center gap-1">
            <button
              class="btn btn-primary btn-xs"
              onClick={() => properties.handleRetry()}
              title="Retry"
            >
              <RetryIcon class="w-4 h-4" />
              Retry
            </button>
            <IconPointFilled class="text-red-600" />
          </div>
        </div>
      </Match>
      <Match when={properties.state === ConnectionState.Disconnected}>
        <div class="flex items-center justify-between">
          <p class="font-bold text-error">Disconnected</p>
          <div class="flex items-center gap-1">
            <button
              class="btn btn-primary btn-xs"
              onClick={() => properties.handleRetry()}
              title="Retry"
            >
              <RetryIcon class="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </Match>
      <Match when={properties.state === ConnectionState.NoMatchFound}>
        <div class="flex items-center justify-between">
          <p class="font-semibold">No Matches Found</p>
          <div class="flex items-center gap-1">
            <button
              class="btn btn-primary btn-xs"
              onClick={() => properties.handleRetry()}
              title="Retry"
            >
              <RetryIcon class="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
        <div>
          Sorry, we couldn't find anyone to chat with right now. Please try
          again later!
        </div>
      </Match>
    </Switch>
  );
};

export default ConnectionIndicator;
