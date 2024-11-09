import { Component, Show } from "solid-js";

import { getStream } from "../../lib/stream";
import { getCurrentScreenSize } from "../../lib/utils";
import VideoViewer from "../video-viewer";
import { ChatProperties } from "./service";
import TextChat from "./text-chat";
import TextChatModal from "./textchat-modal";

const VideoChat: Component<ChatProperties> = (properties) => {
  const screenSize = getCurrentScreenSize();
  return (
    <div class="grid md:grid-cols-12 gap-2 lg:gap-4 h-full">
      <div class="md:col-span-7 md:h-full border border-base-300 rounded-box bg-base-200 overflow-hidden mb-10 md:mb-0">
        <VideoViewer
          trackA={properties.rtcManager?.getRemoteStream()}
          trackB={getStream()!}
        />
      </div>
      <Show
        fallback={<TextChatModal {...properties} />}
        when={screenSize !== "xs" && screenSize !== "sm"}
      >
        <div class="md:col-span-5 md:h-full border border-base-300 rounded-box p-2 overflow-auto">
          <TextChat {...properties} />
        </div>
      </Show>
    </div>
  );
};

export default VideoChat;
