import { makePersisted } from "@solid-primitives/storage";
import {
  Accessor,
  createContext,
  createSignal,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js";

export const DEFAULT_LIGHT = "light";

export const DEFAULT_DARK = "sunset";

export const SUPPORTED_THEMS = [
  "light",
  "retro",
  "cyberpunk",
  "wireframe",
  "cmyk",
  "dim",
  "sunset",
];

const isDarkMode = () => {
  return (
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

const ThemeContext = createContext<{
  setTheme: (theme: string) => void;
  theme: Accessor<string>;
}>();

export const useTheme = () => {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("ThemeContext is not defined");
  }

  return value;
};

export const ThemeContextProvider: ParentComponent = (properties) => {
  const [theme, setTheme] = makePersisted(
    // eslint-disable-next-line solid/reactivity
    createSignal<string>(isDarkMode() ? DEFAULT_DARK : DEFAULT_LIGHT),
    { name: "theme" },
  );

  const handleChangeTheme = (_theme: string) => {
    setTheme(_theme);
    document.documentElement.dataset.theme = _theme;
  };

  onMount(() => {
    document.documentElement.dataset.theme = theme();
  });

  return (
    <ThemeContext.Provider value={{ setTheme: handleChangeTheme, theme }}>
      {properties.children}
    </ThemeContext.Provider>
  );
};
