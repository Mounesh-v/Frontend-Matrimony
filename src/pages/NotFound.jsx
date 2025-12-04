export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold mb-4" style={{ color: "#C2185B" }}>
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-6">
        The page you are trying to access does not exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 rounded font-bold shadow-lg text-white"
        style={{ backgroundColor: "#C2185B" }}
      >
        Go Home
      </a>
    </div>
  );
}
