import { Link } from "react-router-dom";
import ErrorImg from "../assets/404-computer.svg";

function Error404() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <p className="text-5xl font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Page not found</h1>
        <p className="mt-6 text-lg leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="mt-10 flex items-center justify-center gap-x-2">
          <Link
            to={"/home"}
            className="rounded-md text-decoration-none bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
      {/* Responsive Image at the Top */}
      <img
        src={ErrorImg}
        alt="404 Not Found"
        className="w-full max-w-md mb-6 object-cover" // Adjusting max width and adding bottom margin
      />
    </main>
  );
}

export default Error404;
