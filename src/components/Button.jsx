export default function Button({ children, onClick, className }) {
  return (
    <button
      className={
        "bg-white py-1 px-2 rounded-lg drop-shadow active:drop-shadow-none " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
