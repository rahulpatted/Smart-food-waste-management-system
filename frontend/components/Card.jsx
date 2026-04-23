export default function Card({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
