import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { Toaster } from "react-hot-toast";
import DashboardOverview from "./components/Dashboard";
import FileUpload from "./components/FileUpload";
import PDFViewer from "./components/PDFViewer";
import { ForgotPassword } from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { AuthForm } from "./components/AuthForm";
import { NavBar } from "./components/NavBar";

function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background image for direct access to login/signup */}
      {isAuthPage && !state?.backgroundLocation && (
        <div
          className="fixed inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/assets/bgImage.png')" }}
        ></div>
      )}

      {/* Main Routes with background location handling */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/view" element={<PDFViewer />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword closeModal={() => navigate("/")} />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
      </Routes>

      {/* Modal and Direct Routes for Login & Signup */}
      <div className={`fixed inset-0 ${isAuthPage ? "z-20" : "z-0"}`}>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthForm
                isSignup={false}
                closeModal={() => navigate("/")}
                toggleMode={() => navigate("/signup")}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <AuthForm
                isSignup={true}
                closeModal={() => navigate("/")}
                toggleMode={() => navigate("/login")}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
