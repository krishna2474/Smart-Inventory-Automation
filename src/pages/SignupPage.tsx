import { FormArea } from "../components/FormArea";
import { NavBar } from "../components/NavBar";
import { RecoilRoot } from "recoil";

export const SignupPage = () => {
  return (
    <RecoilRoot>
      <div
        className="w-full min-h-screen h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/SignUp BG.png')" }}
      >
        <NavBar type="signup" />
        <FormArea type="signup" />
      </div>
    </RecoilRoot>
  );
};
