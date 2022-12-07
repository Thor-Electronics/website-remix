import { Link } from "@remix-run/react"
import { Copyright } from "../atoms/Copyright"
import { LogoIcon } from "../atoms/LogoIcon"

export const Hero = () => (
  <section className="h-screen bg-blue-500 py-4 text-white relative flex flex-col items-center justify-center gap-4">
    <LogoIcon className="w-48 sm:w-full sm:max-w-xs md:max-w-md mx-auto flex items-center justify-center text-white" />
    <h1 className="text-center text-4xl sm:text-6xl md:text-7xl font-bold italic text-white">
      Thor Electronics
    </h1>
    <h3 className="slogan"></h3>
    {/* <div className="tmp">
      <Link to="/">About</Link>
    </div> */}
    <div className="absolute bottom-4 w-full">
      <Copyright />
    </div>
  </section>
)

export default Hero
