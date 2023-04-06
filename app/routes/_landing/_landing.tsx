// Could be _public.tsx

import { Outlet } from "@remix-run/react"

// routing: https://remix.run/docs/en/1.15.0/file-conventions/route-files-v2#folders-for-organization

export default function LandingLayout() {
  console.log("_landing.tsx")
  return (
    <main className="landing min-h-screen">
      <Outlet />
    </main>
  )
}
