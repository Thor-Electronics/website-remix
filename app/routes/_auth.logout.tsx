import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import type { ActionFunction } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { TextButton } from "~/components/atoms/Button";
import { logout } from "~/models/session.server";

export const action: ActionFunction = async ({ request }) => logout(request);

// export const loader: LoaderFunction = async () => {
//   return redirect("/")
// }

export const LogoutPage = () => {
  const navigation = useNavigation();

  return (
    <Form
      method="post"
      className="bg-white dark:bg-slate-900 border
        border-rose-500 dark:border-rose-600 p-3
        rounded-xl shadow-lg shadow-rose-200
        dark:shadow-rose-800"
    >
      <p>Are you sure you want to log out?</p>
      <div className="flex justify-center items-center gap-4 my-4">
        <TextButton
          className="!bg-rose-500  gap-2.5"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "SIGNING OUT ..." : "SIGN OUT"}
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </TextButton>
      </div>
    </Form>
  );
};

export default LogoutPage;
