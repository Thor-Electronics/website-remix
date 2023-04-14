import { Link } from "@remix-run/react"
import { Copyright } from "../atoms/Copyright"
import { LogoIcon } from "../atoms/LogoIcon"
import type { User } from "~/types/User"
import { TextButton } from "../atoms/Button"

type Props = {
  user?: User
}

export const Hero = ({ user, ...props }: Props) => (
  <section className="min-h-screen bg-blue-500 py-4 text-white relative flex flex-col items-center justify-center gap-4 snap-start">
    <LogoIcon className="w-48 sm:w-full sm:max-w-xs md:max-w-md mx-auto flex items-center justify-center text-white" />
    <h1 className="text-center text-4xl sm:text-6xl md:text-7xl font-bold italic text-white">
      Thor Electronics
    </h1>
    {/* <h3 className="slogan">Live Smart</h3> */}
    <div className="buttons mt-4">
      {user ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="italic text-blue-100">
            Welcome <b>{user.name}</b>!
          </p>
          <Link to="/app">
            <TextButton className="!bg-white !text-blue-500 !rounded-lg py-1.5 px-4 font-semibold">
              Dashboard
            </TextButton>
          </Link>
        </div>
      ) : (
        <div className="flex gap-2">
          {/* <Link to="/login">
            <TextButton className="!bg-transparent border border-white !rounded-lg py-1.5 px-4 font-semibold">
              Login
            </TextButton>
          </Link>
          <Link to="/signup">
            <TextButton className="!bg-white !text-blue-500 border !rounded-lg py-1.5 px-4 font-semibold">
              Sign Up
            </TextButton>
          </Link> */}
        </div>
      )}
    </div>
    <div className="absolute bottom-4 w-full">
      <Copyright />
    </div>
  </section>
)

export default Hero
