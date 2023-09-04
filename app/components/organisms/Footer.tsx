import { AtSymbolIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { Copyright } from "../atoms/Copyright";
import { LogoIcon } from "../atoms/LogoIcon";
import { Link } from "@remix-run/react";

export const Footer = () => {
  return (
    <footer
      className="footer min-h-screen bg-blue-50 dark:bg-slate-900
      text-slate-700 dark:text-slate-300 relative flex flex-col
      justify-center items-center gap-7 py-4 px-6 snap-start
      max-w-screen-lg mx-auto" // max-w-screen-xl / 2xl
    >
      <div
        className="flex flex-col items-center justify-center gap-2
          mb-4 sm:flex-row sm:justify-center sm:w-full"
      >
        <LogoIcon className="w-32 flex items-center justify-center sm:w-16" />
        <h2 className="text-2xl font-bold italic mb-4 sm:mb-0 sm:text-4xl">
          Thor Electronics LLC
        </h2>
      </div>
      <div className="line w-full bg-slate-700 dark:bs-slate-300 sm:pt-0.5"></div>
      <div className="flex flex-col sm:flex-row gap-8">
        <p className="text-slate-700 dark:text-slate-300 text-lg text-justify sm:w-6/12">
          Thor Electronics is a tech company building smart devices and
          providing IoT services and cloud networks for businesses with a
          variety of use cases.
        </p>
        <div className="contact flex flex-col gap-4 sm:w-6/12">
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
      </div>

      <div className="links flex items-center justify-center">
        {footerLinks.map((l) => (
          <Link key={l.title} to={l.url} className={`p-4`}>
            {l.title}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 w-full">
        <Copyright />
      </div>
    </footer>
  );
};

const footerLinks: {
  url: string;
  title: string;
}[] = [
  { url: "/app", title: "App" },
  { url: "/", title: "Pricing" }, // pricing
  { url: "/", title: "Homepage" },
  { url: "/", title: "Terms" }, // terms
];

export default Footer;
