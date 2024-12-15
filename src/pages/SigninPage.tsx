// import { SignupNavBar } from "../components/SignupNavBar";
import { FormArea } from "../components/FormArea";
import { NavBar } from "../components/NavBar";
export const SigninPage = () => {
  return (
    <div
      className="w-full min-h-screen h-full bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/SignUp BG.png')" }}
    >
      <NavBar type="signin" />
      <FormArea type="signin" />
    </div>
  );
};
