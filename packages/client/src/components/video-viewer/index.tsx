import { Component, createSignal } from "solid-js";

import AmbientVideo from "../ambient-video";
import styles from "./styles.module.css";

const VideoViewer: Component<{
  trackA: MediaStream | undefined;
  trackB: MediaStream | undefined;
}> = (properties) => {
  const [isTrackAFocused, setTrackAFocused] = createSignal(true);

  const minimizedContainerClass = `${styles.overlay} absolute h-auto overflow-hidden top-2 right-2 w-[40%] md:w-[25%] rounded-lg border border-base-300 border-opacity-60 z-30 bg-black`;
  const maximizedContainerClass = "w-full h-full relative ";

  return (
    <div class="w-full h-full relative bg-base-200">
      <AmbientVideo
        classList={{
          [maximizedContainerClass]: isTrackAFocused(),
          [minimizedContainerClass]: !isTrackAFocused(),
        }}
        mediaStream={properties.trackA}
        onClick={() => setTrackAFocused(true)}
      />
      <AmbientVideo
        classList={{
          [maximizedContainerClass]: !isTrackAFocused(),
          [minimizedContainerClass]: isTrackAFocused(),
        }}
        mediaStream={properties.trackB}
        muted
        onClick={() => setTrackAFocused(false)}
      />
    </div>
  );
};

export default VideoViewer;
