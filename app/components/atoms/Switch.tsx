import type { HTMLAttributes } from "react"

interface IProps extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean
  disabled?: boolean
  // onChange?: Function
}

export const Switch = ({ checked, className, ...props }: IProps) => {
  return (
    <div
      className={`Switch ${checked ? "checked" : ""} ${className}`}
      {...props}
    >
      <div className={`circle ${checked ? "bg-white" : "bg-slate-50"}`}></div>
    </div>
  )
}
