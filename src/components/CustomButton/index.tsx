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
  const defaultClasses = `bwa-bg-yellow-700 hover:bwa-bg-yellow-800`;
  const buttonClasses = `bwa-flex bwa-items-center bwa-justify-center bwa-px-4 bwa-py-2 bwa-rounded-md bwa-transition-all bwa-shadow-sm ${defaultClasses} ${className} ${border}`;

  if (link && href) {
    return (
      <a href={href}>
        <button
          className={!className ? buttonClasses : className}
          {...(disabled ? { "aria-disabled": true, tabIndex: -1 } : {})}
          {...props}
        >
          {Icon && <Icon className="bwa-mr-2" />}
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
        <FaSpinner className="bwa-mr-2 bwa-animate-spin" />
      ) : (
        <>
          {text}
          {Icon && <Icon className="bwa-ml-2" />}
        </>
      )}
    </button>
  );
};

export default CustomButton;
