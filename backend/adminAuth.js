var admin = require("firebase-admin");

module.exports.isAuthorized = async (req, res, next) => {
  const { authorization } = req.params;

  if (authorization) {
    const firebaseResult = await admin.auth().verifyIdToken(authorization);

    if (firebaseResult && firebaseResult.admin) {
      return next();
    }
  }

  var err = new Error("Not authorized! Go back!");
  err.status = 401;

  res.status(401).send({ error: "Not Authorized" });
  return next(err);
};
