// components/ui/button.tsx
import { ButtonHTMLAttributes, FC } from "react";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-black hover:bg-gray-100",
  };

  return (
    <button
      {...props}
      className={classNames(baseClasses, variants[variant], className)}
    >
      {children}
    </button>
  );
};
