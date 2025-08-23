import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    border?: string;
    icon?: IconType | null;
    link?: boolean;
    href?: string;
    loading?: boolean;
    className?: string;
}
declare const CustomButton: ({ text, onClick, border, disabled, className, icon: Icon, link, loading, href, ...props }: CustomButtonProps) => React.JSX.Element;
export default CustomButton;
