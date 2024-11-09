import { Component } from "solid-js";

const TypingIndicator: Component = () => (
  <li class="text-center font-semibold flex justify-center">
    <span class="rounded-box px-2 text-sm bg-base-200 border border-base-300 flex gap-1 items-end">
      <span>Typing</span>
      <span class="loading loading-dots loading-xs" />
    </span>
  </li>
);

export default TypingIndicator;
