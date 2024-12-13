import { Route, Routes } from "react-router-dom";
import { SignupPage } from "./pages/SignupPage";
import { SigninPage } from "./pages/SigninPage";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
    </Routes>
  );
}

export default App;
