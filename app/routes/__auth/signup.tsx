import { Link } from "@remix-run/react"
import Button from "~/components/atoms/Button"

export const Signup = () => {
  return (
    <form className="SignupCard card flex flex-col gap-4" method="post">
      <h1 className="title font-bold text-2xl text-center">SIGNUP</h1>
      <div className="inputs flex flex-col gap-4">
        <label className="label">
          Email:
          <input type="text" name="email" placeholder="john.doe@example.com" />
        </label>
        <label className="label">
          Password:
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
          />
        </label>
        {/* <label className="label">
          Re-Password:
          <input
            type="password"
            name="re_password"
            placeholder="Re-enter your password"
          />
        </label> */}
      </div>
      <div className="buttons">
        <Button className="w-full !bg-primary">Signup</Button>
      </div>
      <p className="switch text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" prefetch="render" className="font-semibold">
          Login
        </Link>
        .
      </p>
    </form>
  )
}

export default Signup
