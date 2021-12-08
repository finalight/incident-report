import {
  fireEvent,
  getByTestId,
  act,
  render,
  waitFor,
} from "@testing-library/react";
import AssigneeIncidentList from "./AssigneeIncidentList";
import UserContext from "./UserContext";
import { updateIncidentStatus } from "./incidents";

jest.mock("./incidents", () => ({
  updateIncidentStatus: jest.fn(),
  getIncidents: () => [
    {
      id: 1,
      title: "title 1",
      details: "details 1",
      assignee: "dq9RjK17xrUR2uF1Ev8e0nDwVuJ3",
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

it("should render the correct elements", async () => {
  let getByText;

  act(() => {
    ({ getByText } = render(
      <UserContext.Provider value={{ user: { email: "test@test.com" } }}>
        <AssigneeIncidentList />
      </UserContext.Provider>
    ));
  });

  await waitFor(() => {
    getByText(/You are an assignee/);
    getByText(/test@test.com/);
    getByText(/below are your tasks to handle/);
  });
});

it("should render incidents", async () => {
  let getByText;

  act(() => {
    ({ getByText } = render(
      <UserContext.Provider value={{ user: { email: "test@test.com" } }}>
        <AssigneeIncidentList />
      </UserContext.Provider>
    ));
  });

  await waitFor(() => {
    getByText("title 1");
  });
});

it("should invoke updateIncidentStatusHandler to start", async () => {
  let getByTestId;
  act(() => {
    ({ getByTestId } = render(
      <UserContext.Provider value={{ user: { email: "test@test.com" } }}>
        <AssigneeIncidentList />
      </UserContext.Provider>
    ));
  });

  await waitFor(() => {
    fireEvent.click(getByTestId("start-1"));
  });

  expect(updateIncidentStatus).toHaveBeenCalledWith(1, "In Progress");
});

it("should invoke updateIncidentStatusHandler to finish", async () => {
  let getByTestId;
  act(() => {
    ({ getByTestId } = render(
      <UserContext.Provider value={{ user: { email: "test@test.com" } }}>
        <AssigneeIncidentList />
      </UserContext.Provider>
    ));
  });

  await waitFor(() => {
    fireEvent.click(getByTestId("finish-2"));
  });

  expect(updateIncidentStatus).toHaveBeenCalledWith(2, "Done");
});
