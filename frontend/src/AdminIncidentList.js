import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import "./App.css";
import AssigneesContext from "./AssigneesContext";
import UserContext from "./UserContext";
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
    getIncidents();
  }, []);

  const getIncidents = async () => {
    try {
      const result = await axios.get(`http://localhost:3001/incidents/`, {
        headers: {
          Authorization: user.token,
        },
      });

      setIncidents(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const createIncident = async () => {
    await axios.post("http://localhost:3001/incidents", {
      title,
      details,
      assignee,
      status: "Not Started",
    });
    setTitle('')
    setDetails('')
    setAssignee('')
    await getIncidents();
  };

  const deleteIncident = async (incidentId) => {
    await axios.delete(`http://localhost:3001/incidents/${incidentId}`);
    await getIncidents();
  };

  const assignIncident = async (incidentId, assigneeId) => {
    await axios.put(
      `http://localhost:3001/incidents/${incidentId}/${assigneeId}`
    );
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
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.title}</td>
                    <td>{incident.details}</td>
                    <td>
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(evt) =>
                          assignIncident(incident.id, evt.target.value)
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
                        variant="danger"
                        onClick={() => deleteIncident(incident.id)}
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
                placeholder="Enter title"
                onChange={(evt) => setTitle(evt.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDetails">
              <Form.Control
                as="textarea"
                placeholder="Details here"
                onChange={(evt) => setDetails(evt.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAssignee">
              <Form.Select
                aria-label="Default select example"
                onChange={(evt) => setAssignee(evt.target.value)}
              >
                <option>N/A</option>
                {assignees.map((assignee) => (
                  <option value={assignee.uid}>{assignee.email}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              createIncident();
              handleClose();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default IncidentList;
