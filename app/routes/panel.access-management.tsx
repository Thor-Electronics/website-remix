import { json, type LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/models/session.server";
import { type User } from "~/types/User";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return json<LoaderData>({ user });
};

// Manage Roles, Permissions, Grouped Users
export const ManageAccess = () => {
  const { user } = useLoaderData<LoaderData>(); // <typeof loader>
  return (
    <div className="ManageAccess admin-page">
      <h2 className="page-title">Access Management</h2>
      <nav
        className="access-management flex gap-2 justify-center
        font-semibold text-white dark:text-slate-700"
      >
        <Link
          to="/admin/access-management"
          className="bg-white dark:bg-slate-700 shadow
            rounded-lg py-2 px-4 grow text-center"
        >
          Manufacturers
        </Link>
        <Link
          to="roles"
          className="bg-white dark:bg-slate-700 shadow
            rounded-lg py-2 px-4 grow text-center"
        >
          Roles
        </Link>
        <Link
          to="areas"
          className="bg-white dark:bg-slate-700 shadow
            rounded-lg py-2 px-4 grow text-center"
        >
          Areas
        </Link>
      </nav>
      <Outlet />
      <p
        className="roles text-xs font-semibold text-slate-400
        dark:text-slate-600 text-center"
      >
        Signed in as{" "}
        {user.roles?.map((r) => (
          <span key={r.id} className="text-slate-500 font-bold">
            {r.name}
          </span>
        ))}
      </p>
    </div>
  );
};

export default ManageAccess;
