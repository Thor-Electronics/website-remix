import { Link, Outlet } from "@remix-run/react";
import Maintenance from "~/components/organisms/Maintenance";

export const AuthLayout = () => {
  return (
    <div className="AuthLayout min-h-screen flex flex-col justify-center items-center gap-2">
      {/* <div className="maintenance-container">
        <Maintenance />
      </div> */}
      <Outlet />
      <Link to="/" prefetch="render">
        Home
      </Link>
    </div>
  );
};

export default AuthLayout;
