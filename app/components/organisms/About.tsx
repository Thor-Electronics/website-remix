import { AtSymbolIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { Copyright } from "../atoms/Copyright";
import { LogoIcon } from "../atoms/LogoIcon";

export const About = () => {
  return (
    <div
      className="about min-h-screen bg-blue-50
      dark:bg-slate-900 text-slate-700 dark:text-slate-300
      relative flex flex-col justify-center items-center gap-7
      py-4 px-6 snap-start"
    >
      {/* <p className="text-xl font-bold text-slate-500">ABOUT THOR ELECTRONICS</p> */}
      <div className="headline flex flex-col justify-center items-center max-w-3xl">
        <div className="flex flex-col items-center justify-center gap-2 mb-4 sm:flex-row sm:justify-start sm:w-full">
          <LogoIcon className="w-32 flex items-center justify-center sm:w-16" />
          <h2 className="text-2xl font-bold italic mb-4 sm:mb-0 sm:text-4xl">
            Thor Electronics LLC
          </h2>
        </div>
        <p
          className="text-slate-700 dark:text-slate-300
          text-lg text-justify"
        >
          Thor Electronics is a tech company building smart devices and
          providing IoT services and cloud networks for businesses with a
          variety of use cases.
        </p>
      </div>
      <div
        className="line w-full bg-slate-700 dark:bs-slate-300
          sm:pt-0.5 max-w-3xl"
      ></div>
      <div className="contact flex flex-col gap-4">
        <a
          href="tel:+989123125443"
          className="phone text-slate-700 dark:text-slate-300
            flex gap-2 items-center"
        >
          <PhoneIcon className="w-8" />
          +98 912 312 5443
        </a>
        <a
          href="mailto:info@thor-electronics.com"
          className="email text-slate-700 dark:text-slate-300
            flex gap-2 items-center"
        >
          <AtSymbolIcon className="w-8" />
          info@thor-electronics.com
        </a>
        <a
          href="/"
          className="map text-slate-700 dark:text-slate-300
            flex gap-2 items-center text-sm text-start mb-8"
        >
          <MapPinIcon className="w-8" />
          Quchan University of Technology, Razavi Khorasan, IRAN
        </a>
      </div>

      <div className="absolute bottom-4 w-full">
        <Copyright />
      </div>
    </div>
  );
};

export default About;
