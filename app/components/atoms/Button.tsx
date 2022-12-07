// Styled components is better

import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "sm" | "md" | "lg"
}

export const Button = ({ children, className, ...props }: Props) => (
  <button
    // TODO: use a function to check if there is "bg" in the passed className, then don't use the default bg!
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
