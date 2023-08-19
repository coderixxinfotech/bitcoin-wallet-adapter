import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
import { FaSpinner } from "react-icons/fa";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  activeBgColor?: string;
  activeTextColor?: string;
  disabledBgColor?: string;
  disabledTextColor?: string;
  border?: string;
  borderColor?: string;
  hoverBorder?: string;
  icon?: IconType | null;
  link?: boolean;
  href?: string;
  loading?: boolean;
}

const CustomButton = ({
  text = "Button",
  onClick = () => {},
  bgColor = "bg-accent",
  textColor = "text-white",
  hoverBgColor = "bg-accent_dark",
  hoverTextColor = "text-white",
  activeBgColor = "",
  activeTextColor = "",
  disabledBgColor = "bg-gray-500",
  disabledTextColor = "text-gray-400",
  border = "border-none",
  borderColor = "",
  hoverBorder = "",
  disabled = false,
  className = "",
  icon: Icon = null,
  link = false,
  loading = false,
  href,
  ...props
}: CustomButtonProps) => {
  const buttonClasses = `flex items-center justify-center px-4 py-2 rounded-md shadow-sm
    ${bgColor} ${textColor}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className} ${border} ${borderColor} ${hoverBorder}`;

  const hoverClasses = `${hoverBgColor} ${hoverTextColor}`;
  const activeClasses = `${activeBgColor} ${activeTextColor}`;
  const disabledClasses = `${disabledBgColor} ${disabledTextColor}`;

  if (link && href) {
    return (
      <a href={href}>
        <button
          className={`${buttonClasses} ${
            !disabled && hoverClasses
          } ${activeClasses} ${disabled ? disabledClasses : ""}`}
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
      className={`${buttonClasses} ${
        !disabled && hoverClasses
      } ${activeClasses} ${disabled ? disabledClasses : ""}`}
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
