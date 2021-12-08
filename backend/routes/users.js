var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");

router.get("/", async (req, res, next) => {
  try {
    const users = await admin.auth().listUsers(1000);
    const transformedUser = users.users
      .filter((user) => {
        if(user.customClaims && user.customClaims.admin){
          return user.customClaims.admin !== true
        }
        return true
      })
      .map((user) => ({ uid: user.uid, email: user.email }));
    res.send(transformedUser);
  } catch (e) {
    res.send(e);
  }
});

/* GET users listing. */
router.post("/", async (req, res, next) => {
  const { email, password, isAdmin } = req.body;

  try {
    const createdUser = await admin.auth().createUser({
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(createdUser.uid, { admin: isAdmin });

    res.send(createdUser);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
module.exports = router;
