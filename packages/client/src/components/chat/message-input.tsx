import { Component } from "solid-js";
import IconSend from "~icons/ri/send-plane-fill";

const MessageInput: Component<{
  disabled: boolean;
  onSubmit: (event: Event) => void;
  ref: (element: HTMLInputElement) => void;
}> = (properties) => (
  // eslint-disable-next-line solid/reactivity
  <form class="mt-2" onSubmit={properties.onSubmit}>
    <fieldset
      class="flex items-center gap-2 md:gap-4"
      disabled={properties.disabled}
    >
      <input
        class="input input-bordered flex-1"
        placeholder="Type message"
        ref={properties.ref}
        type="text"
      />
      <button class="btn btn-primary" title="Send">
        <IconSend />
        <span class="hidden lg:inline">Send</span>
      </button>
    </fieldset>
  </form>
);

export default MessageInput;
