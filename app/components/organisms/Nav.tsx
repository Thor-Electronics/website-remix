import { Link } from "@remix-run/react"
import type { User } from "~/types/User"
import { TextButton } from "../atoms/Button"
import { LogoutButton } from "../atoms/LogoutButton"

type Props = {
  user: User
}

export const Nav = ({ user, ...props }: Props) => {
  return (
    <div className="buttons flex gap-2">
      {user ? (
        <>
          <Link to="/app" prefetch="render">
            <TextButton className="!bg-primary">Dashboard</TextButton>
          </Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link to="/signup" prefetch="render">
            <TextButton className="!bg-primary">Signup</TextButton>
          </Link>
          <Link to="/login" prefetch="render">
            <TextButton className="!bg-white !text-slate-700 dark:bg-slate-800 dark:text-white">
              Login
            </TextButton>
          </Link>
        </>
      )}
    </div>
  )
}
