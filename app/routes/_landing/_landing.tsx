// Could be _public.tsx

import { Outlet } from "@remix-run/react"

export default function LandingLayout() {
  console.log("_landing.tsx")
  return (
    <main className="landing min-h-screen">
      <Outlet />
    </main>
  )
}
