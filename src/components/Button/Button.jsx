export default function Button({
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  children,
  ...props
}) {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    danger: "btn-danger",
    warning: "btn-warning",
    info: "btn-info",
    outline: "btn-outline-secondary",
  };

  const finalClassName =
    `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={finalClassName}
      {...props}>
      {children}
    </button>
  );
}
