import axios from "axios";
import {
  deleteIncident,
  getIncidents,
  updateIncidentStatus,
  createIncident,
  assignIncident,
} from "./incidents";
jest.mock("axios");

describe("getIncidents", () => {
  it("should return a list of incidents", async () => {
    const mockIncidents = [
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
    ];
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: mockIncidents })
    );

    const result = await getIncidents("some token");
    expect(result).toEqual(mockIncidents);
  });

  it("should return empty array if no token is passed in", async () => {
    axios.get.mockImplementation(() =>
      Promise.reject({ error: "Not Authorized" })
    );

    const result = await getIncidents();
    expect(result).toEqual([]);
  });
});

describe("updateIncidentStatus", () => {
  it("should invoke correctly", async () => {
    axios.put.mockImplementation(() => Promise.resolve({ data: {} }));

    const result = await updateIncidentStatus(1, "Not Started");
    expect(result).toEqual({});
  });
});

describe("deleteIncident", () => {
  it("should invoke correctly", async () => {
    axios.delete.mockImplementation(() => Promise.resolve({ data: {} }));

    const result = await deleteIncident(1);
    expect(result).toEqual({});
  });
});

describe("createIncident", () => {
  it("should invoke correctly", async () => {
    axios.post.mockImplementation(() => Promise.resolve({ data: {} }));

    const result = await createIncident(1);
    expect(result).toEqual({});
  });
});

describe("assignIncident", () => {
  it("should invoke correctly", async () => {
    axios.put.mockImplementation(() => Promise.resolve({ data: {} }));

    const result = await assignIncident(1);
    expect(result).toEqual({});
  });
});
