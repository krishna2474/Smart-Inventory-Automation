import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Toaster } from "react-hot-toast";
import DashboardOverview from "./components/Dashboard";
import FileUpload from "./components/FileUpload";
import PDFViewer from "./components/PDFViewer";
import { ForgotPassword } from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/view" element={<PDFViewer />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword closeModal={() => {}} />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
      </Routes>
    </>
  );
}

export default App;
