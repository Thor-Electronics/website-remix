import type { HTMLAttributes } from "react"

interface IProps extends HTMLAttributes<HTMLSpanElement> {
  //
}

export default function Badge({ children, ...props }: IProps) {
  return (
    <span className={`Badge ${props.className}`} {...props}>
      {children}
    </span>
  )
}

export const SuccessBadge = (props: IProps) =>
  Badge({ className: "bg-green-500" + props.className, ...props })
