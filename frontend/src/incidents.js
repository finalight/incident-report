import axios from 'axios'

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
    await axios.put(`http://localhost:3001/incidents/${incidentId}/status`, {
      status,
    });
  } catch (e) {
    console.log(e);
  }
};
