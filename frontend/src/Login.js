import axios from "axios";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import AssigneesContext from "./contexts/AssigneesContext";
import UserContext from "./contexts/UserContext";
function App() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const { setAssignees } = useContext(AssigneesContext);
  const login = async () => {
    try {
      const auth = await getAuth();
      const currentUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await currentUser.user.getIdTokenResult();

      const userObj = {
        uid: currentUser.user.uid,
        email: currentUser.user.email,
        isAdmin: token.claims.admin || false,
        token: token.token
      };

      setUser(userObj);
      if (token.claims.admin) {
        const response = await axios.get("http://localhost:3001/users");
        setAssignees(response.data);
      }
      navigate("/incidents");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(evt) => setEmail(evt.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(evt) => setPassword(evt.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => login()}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
