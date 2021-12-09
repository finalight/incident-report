import { useContext } from "react";
import AdminIncidentList from "./incidents/AdminIncidentList";
import AssigneeIncidentList from "./incidents/AssigneeIncidentList";
import UserContext from "./contexts/UserContext";
function Dashboard() {
  const { user } = useContext(UserContext);

  return user.isAdmin ? <AdminIncidentList /> : <AssigneeIncidentList />;
}

export default Dashboard;
