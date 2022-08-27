import { Link, Outlet } from "@remix-run/react"

export const AuthLayout = () => {
  return (
    <div className="AuthLayout min-h-screen flex flex-col justify-center items-center gap-2">
      <Outlet />
      <Link to="/" prefetch="render">
        Home
      </Link>
    </div>
  )
}

export default AuthLayout
