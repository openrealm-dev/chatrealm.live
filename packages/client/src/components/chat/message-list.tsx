import { Component, For, Show } from "solid-js";

import Message from "./message";
import { LocalMessage } from "./service";
import TypingIndicator from "./typing-indicator";

const MessageList: Component<{
  isLastMessageSeen: boolean;
  isTyping: boolean;
  lastUserMessageIndex: number;
  messages: LocalMessage[];
  ref: (element: HTMLUListElement) => void;
}> = (properties) => (
  <ul
    class="flex-1 flex flex-col gap-2.5 min-h-0 overflow-auto"
    ref={properties.ref}
  >
    <For each={properties.messages}>
      {(message, index) => (
        <li classList={{ "mt-auto": index() === 0 }}>
          <Message
            isLastMessageSeen={properties.isLastMessageSeen}
            isLastUserMessage={index() === properties.lastUserMessageIndex}
            message={message}
          />
        </li>
      )}
    </For>
    <Show when={properties.isTyping}>
      <TypingIndicator />
    </Show>
  </ul>
);

export default MessageList;
