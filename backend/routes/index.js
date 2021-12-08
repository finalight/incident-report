var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/verify", async (req, res, next) => {

  try{
    const result = await admin
    .auth()
    .getUser("Ewyw0y2q7iMqLlTJ3DAabjmMqxE2");

  res.send(result);
  }catch(e){
    res.send(e)
  }
 
});
module.exports = router;
