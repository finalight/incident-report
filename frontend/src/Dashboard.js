import { useContext } from "react";
import AdminIncidentList from "./AdminIncidentList";
import "./App.css";
import AssigneeIncidentList from "./AssigneeIncidentList";
import UserContext from "./UserContext";
function Dashboard() {
  const { user } = useContext(UserContext);

  return user.isAdmin ? <AdminIncidentList /> : <AssigneeIncidentList />;
}

export default Dashboard;
