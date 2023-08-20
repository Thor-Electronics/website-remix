import type { HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  disabled?: boolean;
  // onChange?: Function
}

export const Switch = ({ checked, className, ...props }: IProps) => {
  return (
    <input
      type="checkbox"
      className={`Switch ${className}`}
      checked={checked}
      {...props}
    />
  );
};

{
  /* <div
  className={`Switch ${checked ? "checked" : ""} ${className}`}
  {...props}
>
  <div
    className={`circle ${
      checked
        ? "bg-white dark:bg-slate-600"
        : "bg-slate-50 dark:bg-slate-700"
    }`}
  ></div>
</div> */
}
