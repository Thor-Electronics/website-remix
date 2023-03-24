import type { User } from "~/types/User"

type LoaderData = {
  user: User
  token: string
  users: User[]
}

export const ManageRoles = () => {
  return <div className="manage-roles">MANAGE ROLES</div>
}

export default ManageRoles
