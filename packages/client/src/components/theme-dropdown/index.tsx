import { Component, For } from "solid-js";
import IconSunMoon from "~icons/mdi/theme-light-dark";

import { SUPPORTED_THEMS, useTheme } from "../../lib/theme-context";

const ThemeDropdown: Component = () => {
  const { setTheme, theme: activeTheme } = useTheme();

  return (
    <div class="dropdown dropdown-left z-40">
      <div
        class="btn m-1 btn-sm"
        role="button"
        tabindex="0"
        title="Change Theme"
      >
        <IconSunMoon />
      </div>
      <ul
        class="dropdown-content bg-base-200 bg-opacity-95 border border-base-300 rounded-box z-[1] w-52 p-2 shadow-sm"
        tabindex="0"
      >
        <For each={SUPPORTED_THEMS}>
          {(theme) => (
            <li>
              <button
                class="capitalize btn btn-sm w-full justify-start"
                classList={{ "btn-active": activeTheme() === theme }}
                onClick={() => setTheme(theme)}
                title={theme}
              >
                {theme}
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default ThemeDropdown;
