import { User } from "~/models/session.server"
import { DashboardUserProfile } from "../molecules/DashboardUserProfile"
import { Logo } from "../atoms/Logo"

type Props = {
  user: User
}

export const DashboardNav = ({ user, ...props }: Props) => {
  return (
    <div className="DashboardNav">
      <Logo />
      <DashboardUserProfile user={user} />
      {/* <div className="list">
        <Link to="buildings">Buildings</Link>
        <Link to="subscription">Subscription</Link>
      </div> */}
    </div>
  )
}
