import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
