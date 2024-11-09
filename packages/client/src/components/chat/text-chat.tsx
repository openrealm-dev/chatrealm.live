import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";

import {
  ConnectionState,
  DataMessage,
  DataSeenMessage,
  DataTextMessage,
} from "../../lib/types";
import { throttle } from "../../lib/utils";
import MessageInput from "./message-input";
import MessageList from "./message-list";
import { ChatProperties, LocalMessage } from "./service";

const TextChat: Component<ChatProperties> = (properties) => {
  const [inputReference, setInputReference] = createSignal<HTMLInputElement>();
  const [listReference, setListReference] = createSignal<HTMLUListElement>();

  const [messages, setMessages] = createSignal<LocalMessage[]>([]);
  const [isTyping, setIsTyping] = createSignal(false);
  const [isLastMessageSeen, setIsLastMessageSeen] = createSignal(false);

  const isDisabled = createMemo(
    () => properties.connectionState !== ConnectionState.Connected,
  );

  const lastUserMessageIndex = createMemo(() =>
    messages().findLastIndex((m) => m.type === "sent"),
  );

  let typingTimeout: number | undefined;
  let lastUnseenMessageId: number | undefined;
  let lastUserMessageId: number;

  const scrollToBottom = (node: HTMLUListElement) => {
    node.scroll({ behavior: "smooth", top: node.scrollHeight });
  };

  const addMessage = (text: string, type: LocalMessage["type"]) => {
    setMessages((previous) => [
      ...previous,
      { text, timestamp: Date.now(), type },
    ]);
    scrollToBottom(listReference()!);
  };

  const handleFormSubmit = (event: Event) => {
    event.preventDefault();
    if (isDisabled()) return;

    const message = inputReference()!.value.trim();
    if (!message) return;

    setIsLastMessageSeen(false);
    lastUserMessageId = properties.rtcManager!.sendMessage(message);
    inputReference()!.value = "";
    addMessage(message, "sent");
  };

  const handlePeerTyping = () => {
    clearTimeout(typingTimeout);
    setIsTyping(true);
    scrollToBottom(listReference()!);
    typingTimeout = setTimeout(() => setIsTyping(false), 2100);
  };

  const handleNewMessage = (data: DataTextMessage) => {
    setIsTyping(false);
    properties.onMessage?.();
    addMessage(data.payload.message, "received");
    if (document.hasFocus()) {
      properties.rtcManager?.sendSeenAcknowledgement(data.payload.id);
    } else {
      lastUnseenMessageId = data.payload.id;
      new Notification("New Message", { body: data.payload.message });
    }
  };

  const handlePeerSeenAcknowledgement = (data: DataSeenMessage) => {
    if (lastUserMessageId === data.payload.id) {
      setIsLastMessageSeen(true);
    }
  };

  const handleMessageFromPeer = (rawMessage: string) => {
    let message: DataMessage | string = rawMessage;
    let isPeerUsingUpdatedApp = false;

    try {
      message = JSON.parse(rawMessage);
      isPeerUsingUpdatedApp = true;
    } catch {
      // If parsing fails, treat it as a simple string message
    }

    if (!isPeerUsingUpdatedApp) {
      addMessage(message as string, "received");
      return;
    }

    const data = message as DataMessage;
    switch (data.type) {
      case "message": {
        handleNewMessage(data);
        break;
      }
      case "seen": {
        handlePeerSeenAcknowledgement(data);
        break;
      }
      case "typing": {
        handlePeerTyping();
        break;
      }
    }
  };

  const handleWindowFocus = () => {
    if (lastUnseenMessageId) {
      properties.rtcManager?.sendSeenAcknowledgement(lastUnseenMessageId);
      lastUnseenMessageId = undefined;
    }
  };

  const handleConnectionStateChange = (state: ConnectionState) => {
    setIsTyping(false);

    switch (state) {
      case ConnectionState.Connected: {
        const initialMessages = [
          { text: "You are now connected", type: "system" },
          ...(properties.matchingInterests.length > 0
            ? [
                {
                  text: properties.matchingInterests.join(", "),
                  type: "system",
                },
              ]
            : []),
        ] as LocalMessage[];
        setMessages(initialMessages);
        scrollToBottom(listReference()!);
        break;
      }
      case ConnectionState.Connecting: {
        setMessages([]);
        break;
      }
      case ConnectionState.Disconnected: {
        addMessage("Disconnected", "system");
        scrollToBottom(listReference()!);
        break;
      }
    }
  };

  // Effects
  createEffect(
    on(
      () => properties.rtcManager,
      () => {
        properties.rtcManager?.on("data-message", handleMessageFromPeer);
      },
    ),
  );

  createEffect(
    on(() => properties.connectionState, handleConnectionStateChange),
  );

  // Lifecycle
  onMount(() => {
    const throttledTypingNotification = throttle(
      () => properties.rtcManager?.informUserTyping(),
      2000,
    );
    inputReference()!.addEventListener("input", throttledTypingNotification);
    window.addEventListener("focus", handleWindowFocus);

    onCleanup(() => {
      inputReference()!.removeEventListener(
        "input",
        throttledTypingNotification,
      );
      window.removeEventListener("focus", handleWindowFocus);
    });
  });

  return (
    <div class="flex flex-col h-full">
      <MessageList
        isLastMessageSeen={isLastMessageSeen()}
        isTyping={isTyping()}
        lastUserMessageIndex={lastUserMessageIndex()}
        messages={messages()}
        ref={setListReference}
      />
      <MessageInput
        disabled={isDisabled()}
        onSubmit={handleFormSubmit}
        ref={setInputReference}
      />
    </div>
  );
};

export default TextChat;
