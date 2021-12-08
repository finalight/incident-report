import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import "./App.css";
import UserContext from "./UserContext";
import { getIncidents, updateIncidentStatus } from "./incidents";
function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchIncidentsAPI() {
      const result = await getIncidents(user.token);
      setIncidents(result);
    }

    fetchIncidentsAPI();
  }, []);

  const updateIncidentStatusHandler = async (incidentId, status) => {
    try {
      await updateIncidentStatus(incidentId, status);
      setIncidents(getIncidents(user.token));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          You are an assignee ({user.email}), below are your tasks to handle
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Incident Title</th>
                <th>Incident details</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents &&
                incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.title}</td>
                    <td>{incident.details}</td>
                    <td>{incident.status}</td>
                    <td>
                      {incident.status === "Not Started" && (
                        <Button
                          data-testid={`start-${incident.id}`}
                          variant="primary"
                          onClick={() =>
                            updateIncidentStatusHandler(
                              incident.id,
                              "In Progress"
                            )
                          }
                        >
                          Start
                        </Button>
                      )}
                      {incident.status === "In Progress" && (
                        <Button
                          data-testid={`finish-${incident.id}`}
                          variant="success"
                          onClick={() =>
                            updateIncidentStatusHandler(incident.id, "Done")
                          }
                        >
                          Finish
                        </Button>
                      )}

                      {incident.status === "Done" && (
                        <span>Nothing to act on</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
