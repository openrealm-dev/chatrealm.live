import { Component, createEffect, createSignal, Show } from "solid-js";
import ChevronUp from "~icons/heroicons/chevron-up";
import CloseIcon from "~icons/heroicons/x-circle-16-solid";
import ChatIcon from "~icons/ic/round-chat-bubble";

import { ChatProperties } from "./service";
import TextChat from "./text-chat";

const TextChatModal: Component<ChatProperties> = (properties) => {
  const [showModal, setShowModal] = createSignal(false);
  const [hasNotifications, setHasNotifications] = createSignal(false);

  const handleNewMessage = () => {
    if (!showModal()) {
      setHasNotifications(true);
    }
  };

  createEffect(() => {
    if (showModal()) {
      setHasNotifications(false);
    }
  });

  return (
    <div class="fixed left-0 right-0 bottom-0 bg-base-300 z-50 py-2 px-4 font-semibold rounded-t-box">
      <button
        class="w-full text-center flex justify-between items-center"
        onClick={() => setShowModal(true)}
      >
        <span class="flex items-center gap-1">
          <ChatIcon class="w-4 h-4" /> Chat
          <Show when={hasNotifications()}>
            <span class="badge badge-sm badge-error !w-2.5 !h-2.5 rounded-full" />
          </Show>
        </span>
        <ChevronUp class="w-5 h-5" />
      </button>
      <dialog class="modal modal-bottom" open={showModal()}>
        <div class="modal-box h-full flex flex-col p-0">
          <div class="flex justify-between items-center bg-base-300 p-2">
            <h3 class="font-bold">Chat</h3>
            <button
              class="btn btn-circle btn-ghost btn-sm"
              onClick={() => setShowModal(false)}
            >
              <CloseIcon class="w-5 h-5 text-error" />
            </button>
          </div>
          <div class="flex-1 min-h-0  p-4">
            <TextChat {...properties} onMessage={handleNewMessage} />
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TextChatModal;
