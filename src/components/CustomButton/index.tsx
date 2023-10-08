import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
import { FaSpinner } from "react-icons/fa";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  border?: string;
  icon?: IconType | null;
  link?: boolean;
  href?: string;
  loading?: boolean;
  className?: string;
}

const CustomButton = ({
  text = "Button",
  onClick = () => {},
  border = "",
  disabled = false,
  className = "",
  icon: Icon = null,
  link = false,
  loading = false,
  href,
  ...props
}: CustomButtonProps) => {
  const defaultClasses = `bg-yellow-700 hover:bg-yellow-800`;
  const buttonClasses = `flex items-center justify-center px-4 py-2 rounded-md transition-all shadow-sm ${defaultClasses} ${className} ${border}`;

  if (link && href) {
    return (
      <a href={href}>
        <button
          className={!className ? buttonClasses : className}
          {...(disabled ? { "aria-disabled": true, tabIndex: -1 } : {})}
          {...props}
        >
          {Icon && <Icon className="mr-2" />}
          {text}
        </button>
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={!className ? buttonClasses : className}
      disabled={disabled}
      {...(disabled ? { "aria-disabled": true, tabIndex: -1 } : {})}
      {...props}
    >
      {loading ? (
        <FaSpinner className="mr-2 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="mr-2" />}
          {text}
        </>
      )}
    </button>
  );
};

export default CustomButton;
