import { Component, Match, onMount, Switch } from "solid-js";

const PermissionModal: Component<{ error: Error; onClose: () => void }> = (
  properties,
) => {
  let modalReference: HTMLDialogElement;

  onMount(() => {
    modalReference.showModal();
  });

  return (
    <dialog class="modal modal-bottom sm:modal-middle" ref={modalReference!}>
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          Unable to access camera and microphone
        </h3>
        <Switch>
          <Match when={properties.error.name === "NotAllowedError"}>
            <p class="py-4">
              You have denied access to the camera and microphone. Please allow
              access to use video chat.
            </p>
          </Match>
          <Match when={properties.error.name === "NotFoundError"}>
            <p class="py-4">
              No camera or microphone found. Please connect a camera and
              microphone to use video chat.
            </p>
          </Match>
          <Match
            when={[
              "AbortError",
              "NotReadableError",
              "OverconstrainedError",
              "SecurityError",
              "TypeError",
              "UnknownError",
            ].includes(properties.error.name)}
          >
            <p class="py-4">
              Your camera or microphone is being used by another application.
              Please close the application and try again.
            </p>
          </Match>
        </Switch>
        <div class="modal-action">
          <form method="dialog" onSubmit={() => properties.onClose()}>
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default PermissionModal;
