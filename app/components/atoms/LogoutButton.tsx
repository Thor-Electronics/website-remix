import Button, { Props } from "./Button"

export const LogoutButton = ({ children = "Logout", ...props }: Props) => (
  <form action="/logout" method="post">
    <Button type="submit" className="!bg-rose-600" {...props}>
      {children}
    </Button>
  </form>
)
