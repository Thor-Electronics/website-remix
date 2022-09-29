// Styled components is better

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "sm" | "md" | "lg"
}

export const Button = ({ children, className, ...props }: Props) => (
  <button
    className={`btn bg-slate-400 text-white transition-all shadow-md rounded-md //dark:highlight-white/5 flex flex-row items-center justify-center gap-1 ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const IconButton = (props: Props) => (
  <Button {...props} className={`p-1 ${props.className}`} />
)
export const TextButton = (props: Props) => (
  <Button {...props} className={`py-1 px-3 ${props.className}`} />
)

export default Button
