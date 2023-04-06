import type { User } from "~/types/User"

type LoaderData = {
  user: User
  token: string
  users: User[]
}

export const ManageGroupedUsers = () => {
  return (
    <div className="manage-grouped-users">
      MANAGE GROUPED USERS specially MANUFACTURERS
    </div>
  )
}

export default ManageGroupedUsers
