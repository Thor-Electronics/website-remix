import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import {
  useState,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
} from "react";
import type { Permission } from "~/types/User";

export type FixedNavItem = {
  icon: ReactNode;
  label: ReactNode;
  to: string;
  permission?: Permission;
  onClick?: Function;
  props?: HTMLAttributes<HTMLElement>;
};

interface IProps extends HTMLAttributes<HTMLElement> {
  header?: ReactNode;
  items: FixedNavItem[];
  footer?: ReactNode;
  darkModeToggle?: boolean;
}

export const FixedNav = ({
  header,
  footer,
  items,
  className,
  darkModeToggle,
  ...props
}: IProps) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const htmlDocument = document.documentElement;
    const documentIsDark = htmlDocument.classList.contains("dark");
    const browserPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== null) {
      return setIsDark(savedTheme === "dark");
    }
    setIsDark(browserPrefersDark || documentIsDark);
  }, []);

  const switchTheme = () => {
    console.log(`Switching theme... (Is Dark? ${isDark})`);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      // localStorage.removeItem("theme");
      setIsDark(false);
      console.log(`Switched theme to light mode`);
      return;
    }
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setIsDark(true);
    console.log(`Switched theme to dark mode`);
  };

  return (
    <nav
      className={`FixedNav bg-white dark:bg-slate-800 rounded-xl
        p-2 shadow-lg fixed bottom-2 left-2 sm:bottom-auto sm:top-2
        w-full xl:w-32 xl:left-2 xl:bottom-2 z-10 flex flex-row
        sm:flex-col items-stretch justify-between ${className}`}
      {...props}
    >
      <div className="header">{header}</div>

      <ul
        className={`items flex items-center gap-2 overflow-x-auto xl:overflow-x-hidden xl:overflow-y-auto xl:flex-col xl:items-stretch ${
          items.length <= 5 ? "justify-center" : "justify-start"
        }`}
      >
        {/* <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <solution>NO NEED TO USE THESE FAKE STUFF, I JUST REMOVED JUSTIFY-CNETER SO THAT THE PROBLEM WAS FIXED</solution> */}
        {items.map((i) =>
          i.to ? (
            <Link
              to={i.to}
              key={i.to}
              className="sm:grow xl:grow-0"
              prefetch="intent"
            >
              <li
                className={`item flex flex-col items-center
                  justify-center bg-sky-100 dark:bg-slate-700
                  rounded-lg p-2 text-blue-500 dark:text-blue-300
                  ${i.props?.className}`}
              >
                <span className="icon">{i.icon}</span>
                <span className="item-label text-xs font-semibold hidden sm:block">
                  {i.label}
                </span>
              </li>
            </Link>
          ) : undefined
        )}
      </ul>

      <div className="footer">
        {darkModeToggle && (
          <li
            className={`item flex flex-col items-center
              justify-center dark:bg-sky-100 bg-slate-700
              rounded-lg p-2 dark:text-blue-500 text-blue-300
              cursor-pointer`}
            onClick={switchTheme}
          >
            <span className="icon">
              {isDark ? (
                <SunIcon className="w-8 h-8" />
              ) : (
                <MoonIcon className="w-8 h-8" />
              )}
            </span>
            <span className="item-label text-xs font-semibold hidden sm:block">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </li>
        )}
        {footer}
      </div>
    </nav>
  );
};

export default FixedNav;
