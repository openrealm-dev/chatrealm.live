import { Component, For, Show } from "solid-js";
import VideoIcon from "~icons/heroicons/video-camera-20-solid";
import ChatIcon from "~icons/ic/round-chat-bubble";
import IconPlus from "~icons/material-symbols/add-rounded";
import IconX from "~icons/material-symbols/close-rounded";

import { ChatType } from "../../lib/types";

const GetStarted: Component<{
  interests: string[];
  onConnect: (type: ChatType) => void;
  setInterests: (interests: string[]) => void;
}> = (properties) => {
  let inputReference: HTMLInputElement;

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const value = inputReference!.value?.trim().toLowerCase();

    if (
      !value ||
      properties.interests.includes(value) ||
      properties.interests.length >= 15
    ) {
      return;
    }

    inputReference!.value = "";
    properties.setInterests([...properties.interests, value]);
  };

  const removeInterest = (interest: string) => {
    properties.setInterests(
      properties.interests.filter((index) => index != interest),
    );
  };

  return (
    <div class="p-1">
      <div class="mb-4 text-center">
        <h1 class="text-5xl md:text-5xl font-bold mb-2 text-primary">
          chatrealm.live
        </h1>
        <p class="font-medium">
          Connect Openly, Chat Freely - An <strong>Open-Source</strong> Space
          for Real Connections!
        </p>
      </div>
      <div class="bg-base-300 rounded-xl p-2.5 md:p-4 mb-4">
        <form
          class="flex items-center gap-2 md:gap-4 mb-2"
          onSubmit={handleSubmit}
        >
          <input
            class="input input-bordered flex-1"
            placeholder="Type your interests"
            ref={inputReference!}
            type="text"
          />
          <button class="btn btn-primary" title="Add Interest" type="submit">
            <IconPlus class="w-4 h-4" />
            Add
          </button>
        </form>
        <div class="h-32">
          <Show
            fallback={
              <div class="h-full w-full flex items-center justify-center">
                <p class="opacity-60 text-center">
                  Add interests and connect with people who share similar
                  passions.
                </p>
              </div>
            }
            when={properties.interests.length}
          >
            <For each={properties.interests}>
              {(interest) => (
                <button
                  class="badge mr-1 inline-flex gap-1 hover:bg-base-300"
                  onClick={() => removeInterest(interest)}
                >
                  <span>{interest}</span>
                  <IconX class="w-3.5 h-3.5" />
                </button>
              )}
            </For>
          </Show>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4">
        <button
          class="btn btn-primary flex-1"
          onClick={() => properties.onConnect(ChatType.TEXT)}
          title="Text Chat"
        >
          <ChatIcon class="w-5 h-5" /> Text Chat
        </button>

        <button
          class="btn btn-primary flex-1"
          onClick={() => properties.onConnect(ChatType.VIDEO)}
          title="Video Chat"
        >
          <VideoIcon class="w-5 h-5" /> Video Chat
        </button>
      </div>

      <div class="divider" />
      <div class="bg-base-200 rounded-xl p-2.5 md:p-5 my-2">
        <h2 class="text-2xl text-center mb-2 font-semibold">
          Usage Guidelines
        </h2>
        <ul class="flex flex-col gap-2.5 list-disc ml-4">
          <li>
            <strong>Be Respectful:</strong> Treat others with kindness and
            respect. This platform is meant for positive and friendly
            interactions.
          </li>
          <li>
            <strong>No Misuse:</strong> Please don't misuse the platform. Use it
            responsibly, and don't engage in harmful or inappropriate behavior.
          </li>
          <li>
            <strong>Stay Productive:</strong> Remember, life is about growth.
            Don't spend excessive time here. Use this platform during your free
            time, but focus on your goals and aspirations.
          </li>
          <li>
            <strong>Use Wisely:</strong> Only chat when you're free, and make
            the most of your time by being productive in your personal life.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GetStarted;
