import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import AssigneesContext from "../contexts/AssigneesContext";
import UserContext from "../contexts/UserContext";
import {
  deleteIncident,
  getIncidents,
  createIncident,
  assignIncident,
} from "./incidents";
function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const { user } = useContext(UserContext);
  const { assignees } = useContext(AssigneesContext);
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [assignee, setAssignee] = useState("");

  const handleClose = () => setShow(false);

  useEffect(() => {
    async function fetchIncidentsAPI() {
      const result = await getIncidents(user.token);
      setIncidents(result);
    }

    fetchIncidentsAPI();
  }, []);

  const createIncidentHandler = async () => {
    await createIncident(title, details, assignee, user.token);

    setTitle("");
    setDetails("");
    setAssignee("");
    const result = await getIncidents(user.token);
    setIncidents(result);
    handleClose();
  };

  const deleteIncidentHandler = async (incidentId) => {
    await deleteIncident(incidentId, user.token);
    const result = await getIncidents(user.token);
    setIncidents(result);
  };

  const assignIncidentHandler = async (incidentId, assigneeId) => {
    await assignIncident(incidentId, assigneeId);
  };
  return (
    <>
      <Container>
        <Row>
          <Col>List of incidents</Col>
          <Col>
            Your email is {user.email} <br />
            You are admin
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
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.length > 0 &&
                  incidents.map((incident) => (
                    <tr key={incident.id}>
                      <td>{incident.id}</td>
                      <td>{incident.title}</td>
                      <td>{incident.details}</td>
                      <td>
                        <Form.Select
                          aria-label="incident-assignee"
                          data-testid={`select-assignee-${incident.id}`}
                          onChange={(evt) =>
                            assignIncidentHandler(incident.id, evt.target.value)
                          }
                          defaultValue={incident.assignee}
                        >
                          <option value="">N/A</option>
                          {assignees.map((assignee) => (
                            <option key={assignee.uid} value={assignee.uid}>
                              {assignee.email}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>{incident.status}</td>
                      <td>
                        <Button
                          data-testid={`btn-delete-${incident.id}`}
                          variant="danger"
                          onClick={() => deleteIncidentHandler(incident.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => setShow(true)}>Create incident</Button>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicTitle">
              <Form.Control
                type="text"
                aria-label="create-incident-title"
                placeholder="Enter title"
                onChange={(evt) => setTitle(evt.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDetails">
              <Form.Control
                as="textarea"
                aria-label="create-incident-details"
                placeholder="Details here"
                onChange={(evt) => setDetails(evt.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAssignee">
              <Form.Select
                aria-label="create-incident-assignee"
                onChange={(evt) => setAssignee(evt.target.value)}
              >
                <option>N/A</option>
                {assignees.map((assignee) => (
                  <option key={assignee.uid} value={assignee.uid}>
                    {assignee.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createIncidentHandler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default IncidentList;
