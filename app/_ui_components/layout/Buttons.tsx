import Link from "next/link";

type ButtonSize = "lg" | "md" | "sm";

const buttonStyles = {
  primary: {
    lg: "my-1 font-inter font-bold bg-gradient-to-br from-indigo-800/75 to-indigo-950/75 text-txtprimary text-2xl text-shadow-sm drop-shadow px-20 py-4 rounded-lg border-[1px] border-teal-500 transition-all hover:scale-105 disabled:brightness-50 hover:shadow-xl shifty",
    md: "my-1 font-inter font-bold bg-gradient-to-br from-indigo-800/75 to-indigo-950/75 text-txtprimary text-lg text-shadow-sm drop-shadow px-16 py-2 rounded-lg border-[1px] border-teal-500 transition-all hover:scale-105 disabled:brightness-50 hover:shadow-xl shifty",
    sm: "my-1 font-inter font-bold bg-gradient-to-br from-indigo-800/75 to-indigo-950/75 text-txtprimary text-md text-shadow-sm drop-shadow px-6 py-2 rounded-lg border-[1px] border-teal-500 transition-all hover:scale-105 disabled:brightness-50 hover:shadow-xl shifty",
  },
  secondary: {
    lg: "font-inter bg-white/5 border-[1px] border-teal-700 text-txtprimary text-shadow-sm text-2xl px-20 py-4 rounded-lg drop-shadow transition-all hover:scale-105 hover:bg-white/10 hover:border-teal-600 hover:shadow-xl disabled:brightness-50",
    md: "font-inter bg-white/5 border-[1px] border-teal-700 text-txtprimary text-shadow-sm text-lg px-16 py-2 rounded-lg drop-shadow transition-all hover:scale-105 hover:bg-white/10 hover:border-teal-600 hover:shadow-xl disabled:brightness-50",
    sm: "font-inter bg-white/5 border-[1px] border-teal-700 text-txtprimary text-shadow-sm text-md px-6 py-2 rounded-lg drop-shadow transition-all hover:scale-105 hover:bg-white/10 hover:border-teal-600 hover:shadow-xl disabled:brightness-50",
  },
};

function getButtonStyles(
  variant: "primary" | "secondary",
  size: ButtonSize,
  className?: string
) {
  return `${buttonStyles[variant][size]} ${className || ""}`;
}

type BaseButtonProps = {
  children: React.ReactNode;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
};

type ButtonProps = BaseButtonProps & {
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
};

type LinkButtonProps = BaseButtonProps & {
  href: string;
};

export function Button({
  children,
  onClick,
  size = "md",
  type = "button",
  className,
  disabled,
  variant = "primary",
}: ButtonProps & { variant: "primary" | "secondary" }) {
  return (
    <button
      className={getButtonStyles(variant, size, className)}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  size = "md",
  className,
  variant = "primary",
}: LinkButtonProps & { variant: "primary" | "secondary" }) {
  return (
    <Link className={getButtonStyles(variant, size, className)} href={href}>
      {children}
    </Link>
  );
}

export function PrimaryButton(props: ButtonProps) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: ButtonProps) {
  return <Button {...props} variant="secondary" />;
}

export function PrimaryLinkButton(props: LinkButtonProps) {
  return <LinkButton {...props} variant="primary" />;
}

export function SecondaryLinkButton(props: LinkButtonProps) {
  return <LinkButton {...props} variant="secondary" />;
}
