import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { Login } from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
