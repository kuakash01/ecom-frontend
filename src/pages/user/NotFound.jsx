import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="text-center max-w-md bg-white shadow-lg rounded-3xl p-8">

        {/* 404 */}
        <h1 className="text-7xl font-bold text-gray-900 mb-2">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-500 mb-6">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">

          <Link
            to="/"
            className="
              px-6 py-2
              bg-black text-white
              rounded-full
              font-medium
              hover:bg-gray-900
              transition
            "
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="
              px-6 py-2
              border border-gray-300
              rounded-full
              font-medium
              hover:border-black
              transition
            "
          >
            Go Back
          </button>

        </div>

      </div>

    </div>
  );
}

export default NotFound;