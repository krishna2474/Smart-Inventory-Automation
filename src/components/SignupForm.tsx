import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
type FormAreaProps = {
  type: "signup" | "signin";
};
type formData = {
  name: string;
  email: string;
  password: string;
};
export const SignupForm = ({ type }: FormAreaProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>();
  const onSubmit = handleSubmit((data) => console.log(data));
  return (
    <div
      className={`relative bottom-5 flex flex-col items-center justify-center font-nunito ${
        type === "signin" ? "md:mt-10" : "" // Add top margin for signin
      }`}
    >
      <div className="w-full max-w-md rounded-lg">
        <form
          className="space-y-2 md:space-y-4 font-semibold"
          onSubmit={onSubmit}
        >
          <div className="relative bottom-3 sm:hidden flex items-center my-4">
            <hr className="flex-grow border-t border-white" />
            <span className="mx-4 text-white">or</span>
            <hr className="flex-grow border-t border-white" />
          </div>
          <div className="hidden sm:flex sm:flex-col  sm:justify-center sm:items-center  sm:text-sm sm:text-white">
            <p className="text-center sm:text-center">
              {type === "signup"
                ? "Already have an account? "
                : "Don't have an account? "}
              <Link
                to={type === "signup" ? "/signin" : "/signup"}
                className=" relative font-semibold text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-100 hover:after:w-full"
              >
                {type === "signup" ? "Login here" : "Create one here"}
              </Link>
            </p>
          </div>

          {/* Full Name Input (Only for Signup) */}
          <div>
            <input
              {...(register("name"), { required: type === "signup", min: 3 })}
              type="text"
              name="name"
              id="name"
              className={`border-6 text-gray-900 text-sm rounded-lg block w-full p-2.5 ${
                type === "signin" ? "hidden" : ""
              }`}
              placeholder="Full Name"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              {...(register("email"), { required: true })}
              type="email"
              name="email"
              id="email"
              className="text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Email"
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              {...(register("password"), { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          {/* Confirm Password Input (Only for Signup) */}
          <div>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="••••••••"
              className={`text-gray-900 text-sm rounded-lg block w-full p-2.5 ${
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
              className="w-4 h-4 text-customPurple bg-transparent border-gray-300 rounded focus:ring-customPurple transition duration-200 ease-in-out"
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
          <div className="sm:hidden flex flex-col  justify-center items-center text-sm text-white">
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
        </form>
      </div>
    </div>
  );
};
