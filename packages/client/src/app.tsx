import { makePersisted } from "@solid-primitives/storage";
import {
  type Component,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";

import ChatContainer from "./components/chat/container";
import GetStarted from "./components/get-started";
import Navbar from "./components/navbar";
import PermissionModal from "./components/permisson-modal";
import { setStream } from "./lib/stream";
import { ThemeContextProvider } from "./lib/theme-context";
import { ChatType } from "./lib/types";

const App: Component = () => {
  const [chatType, setChatType] = createSignal<ChatType>();
  const [gumError, setGumError] = createSignal<Error>();
  // eslint-disable-next-line solid/reactivity
  const [interests, setInterests] = makePersisted(createSignal<string[]>([]), {
    name: "interests",
  });

  const handleConnect = async (type: ChatType) => {
    if (type === ChatType.VIDEO) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setStream(stream);
      } catch (error) {
        setGumError(error as Error);
        return;
      }
    }

    setChatType(type);
  };

  onMount(() => {
    try {
      Notification.requestPermission();
    } catch {
      // ignore this
    }
    window.scrollTo(0, 1);
  });

  return (
    <ThemeContextProvider>
      <div class="flex flex-col h-full">
        <Navbar handleHomeClick={() => setChatType()} />
        <main class="flex-1 min-h-0">
          <Switch>
            <Match when={chatType() === undefined}>
              <div class="mx-auto flex flex-col gap-4 h-full max-w-screen-lg p-2">
                <GetStarted
                  interests={interests()}
                  onConnect={handleConnect}
                  setInterests={setInterests}
                />
              </div>
            </Match>
            <Match when={chatType() !== undefined}>
              <ChatContainer chatType={chatType()!} interests={interests()} />
            </Match>
          </Switch>
        </main>
      </div>
      <Show when={gumError()}>
        <PermissionModal error={gumError()!} onClose={() => setGumError()} />
      </Show>
    </ThemeContextProvider>
  );
};

export default App;
