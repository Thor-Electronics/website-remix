import { HTMLAttributes } from "react"

interface IProps extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean
  disabled?: boolean
  // onChange?: Function
}

export const Switch = ({ checked, className, ...props }: IProps) => {
  return (
    <div
      className={`Switch rounded-2xl w-12 h-6 p-1 cursor-pointer shadow-md flex ${
        checked ? "bg-green-400 justify-end" : "bg-slate-300"
      } ${className}`}
      {...props}
    >
      <div
        className={`circle w-4 h-4 rounded-2xl shadow-md ${
          checked ? "bg-white" : "bg-slate-50"
        }`}
      ></div>
    </div>
  )
}
