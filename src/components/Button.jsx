export default function Button({
  children,
  onClick,
  className,
  bgColor = "white",
  textColor = "black",
  ...props
}) {
  return (
    <button
      className={`bg-${bgColor} text-${textColor} py-1 px-2 rounded-lg drop-shadow active:drop-shadow-none ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
