import { useSelector } from "react-redux";

const Dashboard = () => {
   const userInfo = useSelector((state) => state.auth.user);
   console.log(userInfo, userInfo?.username);
   return (
      <div>
         <h1>Dashboard</h1>
      </div>
   );
};

export default Dashboard;
