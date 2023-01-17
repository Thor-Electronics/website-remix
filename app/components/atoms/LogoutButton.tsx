import { Form } from "@remix-run/react"
import Button, { Props, TextButton } from "./Button"

export const LogoutButton = ({ children = "Logout", ...props }: Props) => (
  <form action="/logout" method="post">
    <TextButton type="submit" className="!bg-rose-600" {...props}>
      {children}
    </TextButton>
  </form>
)
