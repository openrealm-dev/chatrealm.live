import { Component, Show } from "solid-js";

import ChatMessage from "./chat-message";
import { LocalMessage } from "./service";
import SystemMessage from "./system-message";

const Message: Component<{
  isLastMessageSeen: boolean;
  isLastUserMessage: boolean;
  message: LocalMessage;
}> = (properties) => (
  <Show
    fallback={<SystemMessage text={properties.message.text} />}
    when={properties.message.type !== "system"}
  >
    <ChatMessage
      isLastMessageSeen={properties.isLastMessageSeen}
      isLastUserMessage={properties.isLastUserMessage}
      text={properties.message.text}
      timestamp={properties.message.timestamp}
      type={properties.message.type as "received" | "sent"}
    />
  </Show>
);

export default Message;
