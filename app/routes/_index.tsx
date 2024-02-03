import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import darkStyles from "~styles/dark.css";
import { getOptionalUser, getSessionData } from "~/models/session.server";
import Hero from "~/components/organisms/Hero";
import Footer from "~/components/organisms/Footer";
import type { User } from "~/types/User";

// ROUTING: https://remix.run/docs/en/1.15.0/file-conventions/route-files-v2#folders-for-organization

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: darkStyles,
    media: "(prefers-color-scheme: dark)",
  },
];

type LoaderData = {
  user?: User;
  session: Awaited<ReturnType<typeof getSessionData>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getOptionalUser(request);
  const session = await getSessionData(request);
  return json<LoaderData>({ user, session });
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();

  // const white: RgbColor = { r: 255, g: 255, b: 255 }
  // const thorPrimary: RgbColor = { r: 59, g: 130, b: 246 }
  // const [color, setColor] = useState<RgbColor>(white)

  return (
    <main className="h-full /max-w-6xl mx-auto text-center snap-mandatory snap-y">
      <Hero user={(user as User) ?? undefined} />
      {/* <div>
        <RgbColorPicker color={color} onChange={setColor} />
        <span>
          {color.r}, {color.g}, {color.b}
        </span>
      </div> */}
      <Footer />
    </main>
  );
}
