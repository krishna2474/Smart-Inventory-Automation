import { useAuth0 } from "@auth0/auth0-react";

export const Dashboard = () => {
  const { user } = useAuth0();
  console.log(user);
  return <div className="text-center">This is Dashboard</div>;
};
