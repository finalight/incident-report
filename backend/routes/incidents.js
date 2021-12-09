var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");
var auth = require("../adminAuth");
const { Client } = require("pg");
require("dotenv").config();

router.get("/", async (req, res, next) => {
  const client = new Client();
  try {
   
    await client.connect();
    const firebaseResult = await auth.verifyToken(req.headers["authorization"]);

    let dbResult;
    if (firebaseResult.admin) {
      const query = `select * from incidents order by id;`;
      dbResult = await client.query(query);
    } else {
      const query = `select * from incidents where assignee = $1 order by id;`;
      const values = [firebaseResult.user_id];

      dbResult = await client.query(query, values);
    }

    res.send(dbResult.rows);
  } catch (e) {
    console.log(e);
    res.send(e);
  } finally {
    await client.end();
  }
});

router.put("/:id/status", async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  const client = new Client();
  try {
    if (!["Not Started", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await client.connect();
    const query = `UPDATE incidents set status = $1 where id = $2`;
    const values = [status, id];

    await client.query(query, values);
    await client.end();
    return res.status(200).json({});
  } catch (e) {
    console.log(e);
    return res.send(e);
  } finally {
    await client.end;
  }
});

router.put("/:id/:userId", async (req, res, next) => {
  const { id, userId } = req.params;

  const client = new Client();
  try {
    await client.connect();
    const query = `select * from incidents where id = $1;`;
    const values = [id];

    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      await client.query("UPDATE incidents SET assignee = $1 WHERE id = $2", [
        userId,
        id,
      ]);
    }

    await client.end();
    res.status(200).send({});
    return next();
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
});

router.post("/", auth.isAuthorized, async (req, res, next) => {
  let { title, details, assignee } = req.body;
  const client = new Client();
  try {
    await client.connect();

    if (assignee === "" || assignee === "N/A") {
      assignee = null;
    }

    await client.query(
      `INSERT INTO incidents(title, details, assignee, status)
    values ($1, $2, $3, 'Not Started')`,
      [title, details, assignee]
    );

    await client.end();

    res.status(201).send({});
  } catch (e) {
    console.log(e);
    res.send(e);
  } finally {
    await client.end();
  }
});

router.delete("/:id", auth.isAuthorized, async (req, res, next) => {
  const { id } = req.params;
  const client = new Client();
  try {
    await client.connect();
    const query = "DELETE from incidents where id = $1";
    const values = [id];

    await client.query(query, values);
    await client.end();

    res.status(200).send({});
  } catch (e) {
    console.log(e);
    res.send(e);
  } finally {
    await client.end();
  }
});

module.exports = router;
