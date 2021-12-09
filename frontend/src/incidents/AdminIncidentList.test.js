import {
  act,
  fireEvent,
  getByLabelText,
  render,
  waitFor,
} from "@testing-library/react";
import AdminIncidentList from "./AdminIncidentList";
import { deleteIncident, createIncident, assignIncident } from "./incidents";
import UserContext from "../contexts/UserContext";
import AssigneesContext from "../contexts/AssigneesContext";

jest.mock("./incidents", () => ({
  deleteIncident: jest.fn(),
  createIncident: jest.fn(),
  assignIncident: jest.fn(),
  getIncidents: () => [
    {
      id: 1,
      title: "title 1",
      details: "details 1",
      assignee: "",
      created_at: "2021-12-07T21:02:02.362Z",
      updated_at: "2021-12-07T21:02:02.362Z",
      status: "Not Started",
    },
    {
      id: 2,
      title: "title 2",
      details: "details 2",
      assignee: "",
      created_at: "2021-12-07T21:17:02.932Z",
      updated_at: "2021-12-07T21:17:02.932Z",
      status: "In Progress",
    },
  ],
}));

describe("AdminIncidentList", () => {
  let getByText;
  let getByTestId;
  let getByLabelText;
  const setAssigneesMock = jest.fn();
  const assignees = [
    {
      email: "user1@user.com",
      uid: "uid 1",
    },
    {
      email: "user2@user.com",
      uid: "uid 2",
    },
  ];
  beforeEach(async () => {
    await act(async () => {
      ({ getByText, getByTestId, getByLabelText } = render(
        <UserContext.Provider
          value={{ user: { email: "test@test.com", token: "some token" } }}
        >
          <AssigneesContext.Provider
            value={{ assignees: assignees, setAssigness: setAssigneesMock }}
          >
            <AdminIncidentList />
          </AssigneesContext.Provider>
        </UserContext.Provider>
      ));
    });
  });

  it("should render the correct elements", async () => {
    getByText(/You are admin/);
  });

  it("should render incidents", async () => {
    getByText("title 1");
    getByText("title 2");
  });

  it("should invoke deleteIncident on press", async () => {
    await waitFor(() => {
      fireEvent.click(getByTestId("btn-delete-1"));
    });

    expect(deleteIncident).toHaveBeenCalledWith(1);
  });

  describe("create incident modal", () => {
    it("should invoke create incident handler when save changes is clicked", async () => {
      fireEvent.click(getByText("Create incident"));

      fireEvent.change(getByLabelText("create-incident-title"), {
        target: { value: "incident title" },
      });
      fireEvent.change(getByLabelText("create-incident-details"), {
        target: { value: "incident details" },
      });
      fireEvent.change(getByLabelText("create-incident-assignee"), {
        target: { value: "uid 1" },
      });
      fireEvent.click(getByText("Save Changes"));

      await waitFor(() => {
        expect(createIncident).toHaveBeenCalledWith(
          "incident title",
          "incident details",
          "uid 1",
          "some token"
        );
      });
    });
  });

  describe("assign incident", () => {
    it("should invoke assigneIncident when assignee is selected", () => {
      fireEvent.change(getByTestId("select-assignee-1"), {
        target: { value: "uid 1" },
      });

      expect(assignIncident).toHaveBeenCalledWith(1, "uid 1");
    });
  });
});
