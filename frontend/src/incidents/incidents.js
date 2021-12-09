import axios from "axios";

export const getIncidents = async (token) => {
  try {
    const result = await axios.get(`http://localhost:3001/incidents/`, {
      headers: {
        Authorization: token,
      },
    });

    return result.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const updateIncidentStatus = async (incidentId, status) => {
  try {
    const result = await axios.put(
      `http://localhost:3001/incidents/${incidentId}/status`,
      {
        status,
      }
    );

    return result.data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteIncident = async (incidentId, token) => {
  try {
    const result = await axios.delete(
      `http://localhost:3001/incidents/${incidentId}`,
      {
        headers: { Authorization: token },
      }
    );
    return result.data;
  } catch (e) {
    console.log(e);
  }
};

export const createIncident = async (title, details, assignee, token) => {
  try {
    const result = await axios.post(
      "http://localhost:3001/incidents",
      {
        title,
        details,
        assignee,
      },
      {
        headers: { Authorization: token },
      }
    );

    return result.data;
  } catch (e) {
    console.log(e);
  }
};

export const assignIncident = async (incidentId, assigneeId) => {
  try {
    const result = await axios.put(
      `http://localhost:3001/incidents/${incidentId}/${assigneeId}`
    );

    return result.data;
  } catch (e) {
    console.log(e);
  }
};
