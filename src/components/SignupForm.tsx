import { Link } from "react-router-dom";

type FormAreaProps = {
  type: "signup" | "signin";
};

export const SignupForm = ({ type }: FormAreaProps) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center font-nunito ${
        type === "signin" ? "md:mt-10" : "" // Add top margin for signin
      }`}
    >
      <div className="w-full max-w-md rounded-lg">
        <form className="space-y-2 md:space-y-4 font-semibold">
          <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start text-sm text-white">
            <p className="text-center sm:text-center">
              {type === "signup"
                ? "Already have an account? "
                : "Don't have an account? "}
              <Link
                to={type === "signup" ? "/signin" : "/signup"}
                className="relative font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-100 hover:after:w-full"
              >
                {type === "signup" ? "Login here" : "Create one here"}
              </Link>
            </p>
          </div>

          {/* Full Name Input (Only for Signup) */}
          <div>
            <input
              type="text"
              name="name"
              id="name"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPurple focus:border-customPurple block w-full p-2.5 ${
                type === "signin" ? "hidden" : ""
              }`}
              placeholder="Full Name"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPurple focus:border-customPurple block w-full p-2.5"
              placeholder="Email"
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPurple focus:border-customPurple block w-full p-2.5"
            />
          </div>

          {/* Confirm Password Input (Only for Signup) */}
          <div>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="••••••••"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customPurple focus:border-customPurple block w-full p-2.5 ${
                type === "signin" ? "hidden" : ""
              }`}
            />
          </div>

          {/* Checkbox for Terms and Conditions (Only for Signup) */}
          <div
            className={`${type === "signin" ? "hidden" : ""} flex items-center`}
          >
            <input
              id="link-checkbox"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500 transition duration-200 ease-in-out"
            />
            <label className="ms-2 text-sm font-medium dark:text-gray-300">
              I agree with the{" "}
              <a
                href="#"
                className="relative font-medium after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-100 hover:after:w-full text-blue-500"
              >
                terms and conditions
              </a>
              .
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-customPurple hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all duration-300 ease-in-out"
            >
              {type === "signup" ? "Create an Account" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
