import { DateTime } from "luxon";
import { Component, Show } from "solid-js";

type ChatMessageProperties = {
  isLastMessageSeen: boolean;
  isLastUserMessage: boolean;
  text: string;
  timestamp: number;
  type: "received" | "sent";
};

const ChatMessage: Component<ChatMessageProperties> = (properties) => (
  <div
    class="chat"
    classList={{
      "chat-end chat-primary": properties.type === "sent",
      "chat-start chat-secondary": properties.type === "received",
    }}
  >
    <div
      class="chat-bubble"
      classList={{
        "chat-bubble-primary": properties.type === "sent",
        "chat-bubble-secondary": properties.type === "received",
      }}
    >
      {properties.text}
    </div>
    <div class="chat-footer opacity-50 text-xs">
      <Show when={properties.isLastUserMessage}>
        <span>
          <Show fallback="Delivered • " when={properties.isLastMessageSeen}>
            Seen •
          </Show>
        </span>
      </Show>
      <span>
        {DateTime.fromMillis(properties.timestamp).toLocaleString(
          DateTime.TIME_SIMPLE,
        )}
      </span>
    </div>
  </div>
);

export default ChatMessage;
