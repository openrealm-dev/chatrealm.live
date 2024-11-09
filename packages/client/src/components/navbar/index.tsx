import GithubIcon from "~icons/mdi/github";
import { Component } from "solid-js";

import ThemeDropdown from "../theme-dropdown";

const Navbar: Component<{ handleHomeClick: () => void }> = (properties) => {
  return (
    <nav class="navbar bg-base-100 border-b border-base-300 shadow-sm items-center min-h-0">
      <div class="flex-1">
        <button
          class="font-semibold p-2"
          onClick={() => properties.handleHomeClick()}
        >
          chatrealm.live
        </button>
      </div>
      <div class="flex-none gap-2">
        <a
          class="btn btn-xs btn-circle btn-ghost"
          href="https://github.com/devak997/chatrealm"
          target="blank"
        >
          <GithubIcon class="w-5 h-5" />
        </a>
        <ThemeDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
