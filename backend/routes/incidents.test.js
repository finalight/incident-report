const supertest = require("supertest");
const { Client } = require("pg");
const app = require("../app");
const auth = require("../adminAuth");

jest.mock("firebase-admin", () => ({
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
}));

jest.mock("../adminAuth", () => ({
  verifyToken: () => ({
    admin: true,
  }),
  isAuthorized: jest.fn(),
}));

jest.mock("pg", () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

describe("", () => {
  beforeEach(() => {
    client = new Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /incidents", () => {
    it("should retrieve all incidents successfully", async () => {
      client.query.mockResolvedValueOnce({
        rows: [
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
        rowCount: 0,
      });
      await supertest(app)
        .get("/incidents")
        .expect(200)
        .then((response) => {
          // Check type and length
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(2);
        });
    });
  });

  describe("PUT /incidents/:id/status", () => {
    it("should update the incident status successfully", async () => {
      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });
      await supertest(app)
        .put("/incidents/1/status")
        .send({ status: "Done" })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });

    it("should fail the incident status update if status is not valid", async () => {
      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });
      await supertest(app)
        .put("/incidents/1/status")
        .send({ status: "random stuff" })
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ error: "Invalid status" });
        });
    });
  });

  describe("PUT /incidents/:id/:userId", () => {
    it("should set assignee to an incident successfully", async () => {
      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });
      await supertest(app)
        .put("/incidents/1/2")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });
  });

  describe("POST /incidents", () => {
    it("should create incident successfully", async () => {
      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });
      auth.isAuthorized.mockImplementation((req, res, next) => next());
      await supertest(app)
        .post("/incidents")
        .send({
          title: "some title",
          details: "some details",
          assignee: "asdfsa",
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });

    it("should get unauthorized", async () => {
      client.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });

      const err = new Error("Not authorized! Go back!");
      err.status = 401;

      auth.isAuthorized.mockImplementation((req, res, next) => next(err));
      
      await supertest(app)
        .post("/incidents")
        .send({
          title: "some title",
          details: "some details",
          assignee: "asdfsa",
        })
        .expect(401)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });
  });
});
