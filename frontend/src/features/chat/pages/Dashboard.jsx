import { useSelector } from "react-redux";

const Dashboard = () => {
   const user = useSelector((state) => state.auth.user);
   console.log(user, user?.username);
   return (
      <div>
         <h1>Dashboard</h1>
      </div>
   );
};

export default Dashboard;
