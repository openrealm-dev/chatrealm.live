import { Component } from "solid-js";

const SystemMessage: Component<{ text: string }> = (properties) => (
  <div class="text-center font-semibold">
    <span class="badge bg-base-200 border border-base-300">
      {properties.text}
    </span>
  </div>
);

export default SystemMessage;
