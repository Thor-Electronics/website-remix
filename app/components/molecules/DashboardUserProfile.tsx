import { Form } from "@remix-run/react";
import type { User } from "~/types/User";

type Props = {
  user: User;
};

export const DashboardUserProfile = ({ user, ...props }: Props) => (
  <div
    className="DashboardUserProfile flex flex-row items-center
    justify-center gap-1 p-2"
  >
    <div className="name" title={user.email}>
      {user.name}
    </div>
    <Form action="/logout" method="post" className="flex">
      <button
        type="submit"
        title="Logout"
        className="text-rose-600 dark:text-rose-400 rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h4.59l-2.1 1.95a.75.75 0 001.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 10-1.02 1.1l2.1 1.95H6.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </Form>
    {/* <div className="email text-xs">{user.email}</div> */}
  </div>
);
