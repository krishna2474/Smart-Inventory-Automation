import { FormArea } from "../components/FormArea";
import { NavBar } from "../components/NavBar";

export const SignupPage = () => {
  return (
    <div
      className="w-full min-h-screen h-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/assets/SignUp BG.png')" }}
    >
      <NavBar type="signup" />
      <FormArea type="signup" />
    </div>
  );
};
