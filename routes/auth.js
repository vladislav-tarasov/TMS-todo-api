const router = require("express").Router();
const bodyParser = require("body-parser");

const auth = require("../middleware/auth");
const { authModel, DB } = require("../db/db");

router.post("/login", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authModel.getUserByName(username);

    if (user && DB.hash(password) === user.password) {
      const sessionId = await authModel.createSession(user.id);

      return res.status(201).send({
        status: "ok",
        data: {
          sessionId,
        },
      });
    } else {
      res.status(400).send({ status: "auth error", data: null });
    }
  } catch (err) {
    return res.status(400).send({ status: "error", data: null });
  }
});

router.get("/logout", auth(), async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", data: null });

  try {
    await authModel.deleteSession(req.sessionId);
    res.status(200).send({ status: "ok", data: null });
  } catch (err) {
    res.status(400).send({ status: "error", data: null });
  }
});

router.post("/signup", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).send({ status: "signup error", data: null });
  }

  const newUser = await authModel.createUser(username, password);
  const sessionId = await authModel.createSession(newUser.id);

  res.status(201).send({
    status: "ok",
    data: {
      sessionId,
    },
  });
});

module.exports = router;
