import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { TextButton } from "~/components/atoms/Button"
import { logout } from "~/models/session.server"

export const action: ActionFunction = async ({ request }) => logout(request)

// export const loader: LoaderFunction = async () => {
//   return redirect("/")
// }

export const LogoutPage = () => {
  return (
    <form
      method="post"
      className="bg-white border border-rose-500 p-3 rounded-xl shadow-lg shadow-rose-200"
    >
      <p>Are you sure you want to log out?</p>
      <div className="flex justify-center items-center gap-4 my-4">
        <TextButton className="bg-rose-500  gap-2.5">
          SIGN OUT
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </TextButton>
      </div>
    </form>
  )
}

export default LogoutPage
