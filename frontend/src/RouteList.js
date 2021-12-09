import Login from "./Login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import React, { useState, useMemo } from "react";
import AssigneesContext from "./contexts/AssigneesContext";
import UserContext from "./contexts/UserContext";
function RouteList() {
  const [assignees, setAssignees] = useState([]);
  const assigneeValue = useMemo(
    () => ({ assignees, setAssignees }),
    [assignees]
  );

  const [user, setUser] = useState([]);
  const userValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AssigneesContext.Provider value={assigneeValue}>
      <UserContext.Provider value={userValue}>
        <Routes>
          <Route path="incidents" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </AssigneesContext.Provider>
  );
}

export default RouteList;
