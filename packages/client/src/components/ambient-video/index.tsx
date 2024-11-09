import VideoIcon from "~icons/heroicons/video-camera-20-solid";
import {
  Component,
  ComponentProps,
  createEffect,
  createSignal,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";

type AmbientVideoProperties = {
  mediaStream?: MediaStream | null;
  muted?: boolean;
};

const AmbientVideo: Component<
  AmbientVideoProperties & ComponentProps<"div">
> = (properties) => {
  let canvasReference: HTMLCanvasElement;

  const [videoReference, setVideoReference] = createSignal<HTMLVideoElement>();
  const [videoProperties, rootProperties] = splitProps(properties, [
    "mediaStream",
    "muted",
  ]);

  const drawFrame = () => {
    if (
      !videoReference() ||
      videoReference()!.paused ||
      videoReference()!.ended
    ) {
      return;
    }

    const context = canvasReference.getContext("2d");
    if (context) {
      context.drawImage(
        videoReference()!,
        0,
        0,
        videoReference()!.videoWidth,
        videoReference()!.videoHeight,
        0,
        0,
        canvasReference.width,
        canvasReference.height,
      );
    }

    setTimeout(() => requestAnimationFrame(drawFrame), 2000);
  };

  createEffect(() => {
    const reference = videoReference();
    if (!reference) {
      return;
    }

    reference.srcObject = videoProperties.mediaStream!;
    reference.addEventListener("play", drawFrame);

    onCleanup(() => {
      reference.removeEventListener("play", drawFrame);
    });
  });

  return (
    <div {...rootProperties}>
      <div class="relative h-full w-full flex flex-col justify-center">
        <canvas
          class="absolute h-[100%] w-[100%] z-10 blur-3xl transform-gpu"
          ref={canvasReference!}
        />
        <Show
          fallback={
            <div class="flex flex-col items-center justify-center p-4 gap-4">
              <VideoIcon class="text-primary w-12 h-12" />
              <p class="text-2xl font-bold">Peer Video Unavailable</p>
            </div>
          }
          when={videoProperties.mediaStream}
        >
          <div class="w-full h-full object-contain">
            <video
              autoplay
              class="w-full h-full z-20 relative"
              controls={false}
              muted={!!videoProperties.muted}
              playsinline
              ref={setVideoReference}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

export default AmbientVideo;
