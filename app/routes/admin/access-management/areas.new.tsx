import type { User } from "~/types/User"

type LoaderData = {
  user: User
  token: string
  users: User[]
}

export const CreateNewArea = () => {
  return <div className="create-new-area">CREATE NEW AREA</div>
}

export default CreateNewArea
