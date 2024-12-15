import { useAuth0 } from "@auth0/auth0-react";
import { authAtom } from "../atoms/authAtom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
export const Dashboard = () => {
  const isAuthed = useRecoilValue(authAtom);
  const myUser = useRecoilValue(userAtom);
  console.log(isAuthed);
  const nav = useNavigate();
  const { user, isAuthenticated, logout } = useAuth0();
  return (
    <div className="text-center">
      <div className="flex justify-around p-5">
        {isAuthenticated || isAuthed ? (
          <>
            <h2>
              Hello {user?.name}
              {myUser.name} {}
            </h2>
            <button
              type="submit"
              className="text-white bg-customPurple hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition-all duration-300 ease-in-out"
              onClick={() => {
                logout();
                const token = localStorage.getItem("token");
                if (token) {
                  localStorage.removeItem("token");
                }
                nav("/signin");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <h2>This is Dashboard page</h2>
        )}
      </div>
    </div>
  );
};
