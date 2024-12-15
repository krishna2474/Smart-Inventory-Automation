import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../atoms/authAtom";
import { userAtom } from "../atoms/userAtom";
import { useState } from "react";
type FormAreaProps = {
  type: "signup" | "signin";
};

export const SignupForm = ({ type }: FormAreaProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const setUserAtom = useSetRecoilState(userAtom);
  const setAuthAtom = useSetRecoilState(authAtom);
  // Watch the password field to compare it with the confirm password
  const password = watch("password");

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/${type}`,
        data
      );
      const jwt = response.data.token;

      console.log(jwt); // Log the token for debugging
      localStorage.setItem("token", "Bearer " + jwt); // Fix: Add space after "Bearer"
      setAuthAtom(true);

      setUserAtom({
        name: data.name,
        email: data.email,
      });
      alert("Authentication successful!");
      nav("/dashboard");
    } catch (error: any) {
      if (error.response) {
        // Server responded with an error status
        console.error("Error:", error.response.data.error);
        alert("Error: " + error.response.data.error);
      } else {
        // Other errors (network issue, timeout, etc.)
        console.error("An unexpected error occurred:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  });

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
          <div className="hidden sm:flex sm:flex-col sm:justify-center sm:items-center sm:text-sm sm:text-white">
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
              {...register("name", {
                required: type === "signup",
                minLength: 3,
              })}
              type="text"
              name="name"
              id="name"
              className={`${
                errors["name"] ? "focus:border-red-600 focus:ring-red-600" : ""
              } text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 ${
                type === "signin" ? "hidden" : ""
              }`}
              style={{ width: "100%" }}
              placeholder="Full Name"
            />
            {errors["name"] && (
              <p className="text-red-500 text-sm truncate">
                Full name is required.
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please enter a valid email address",
                },
              })}
              type="text"
              name="email"
              id="email"
              className={`${
                errors.email ? "focus:border-red-600 focus:ring-red-600" : ""
              } text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message + ""}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <input
                autoComplete="off"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                type={passwordVisible ? "text" : "password"} // Toggle between text and password
                name="password"
                id="password"
                placeholder="••••••••"
                className={`${
                  errors["password"]
                    ? "focus:border-red-600 focus:ring-red-600"
                    : ""
                } text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500`}
              />{" "}
              {errors["password"] && (
                <p className="text-red-500 text-sm">
                  {errors["password"]?.message + "" || "Password is required."}
                </p>
              )}
              {/* Eye icon */}
              <span
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                className="absolute right-3 top-3 cursor-pointer"
              >
                {passwordVisible ? (
                  <img
                    src={"/assets/eyeSlash.svg"}
                    alt="Hide password"
                    className="h-5 w-5"
                  />
                ) : (
                  <img
                    src={"/assets/eye.svg"}
                    alt="Show password"
                    className="h-5 w-5"
                  />
                )}
              </span>
            </div>
          </div>
          {/* Confirm Password Input (Only for Signup) */}
          <div>
            <input
              {...register("confirm-password", {
                required: type === "signup",
                validate: (value) =>
                  value === password || "Passwords do not match", // Custom validation
              })}
              type={passwordVisible ? "text" : "password"}
              name="confirm-password"
              id="confirm-password"
              placeholder="••••••••"
              className={`${
                errors["confirm-password"]
                  ? "focus:border-red-600 focus:ring-red-600"
                  : ""
              } text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-customPurple focus:border-purple-500 ${
                type === "signin" ? "hidden" : ""
              }`}
            />

            {errors["confirm-password"] && (
              <p className="text-red-500 text-sm">
                {errors["confirm-password"]?.message + ""}
              </p>
            )}
          </div>

          {/* Checkbox for Terms and Conditions (Only for Signup) */}
          <div
            className={`${
              type === "signin" ? "hidden" : ""
            } flex flex-col items-start`}
          >
            <div className="flex items-center">
              <input
                {...register("terms", { required: type === "signup" })}
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

            {/* Display error message below the checkbox */}
            {errors["terms"] && (
              <p className="text-red-500 text-sm mt-1">
                You must agree to the terms and conditions.
              </p>
            )}
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
          <div className="sm:hidden flex flex-col justify-center items-center text-sm text-white">
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
