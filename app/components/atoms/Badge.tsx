import type { DetailedHTMLProps, HTMLAttributes } from "react"

interface IProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {}

export default function Badge({ className, children, ...props }: IProps) {
  return (
    <span className={`Badge ${className ?? ""}`} {...props}>
      {children}
    </span>
  )
}

export const SuccessBadge = (props: IProps) =>
  Badge({ ...props, className: "bg-green-500" + props.className ?? "" })
