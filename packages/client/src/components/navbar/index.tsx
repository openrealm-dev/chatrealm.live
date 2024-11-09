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
      <div class="flex-none">
        <ThemeDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
