const router = require("express").Router();
const auth = require("../middleware/auth");
const bodyParser = require("body-parser");

const { todosModel } = require("../db/db");

router.get("/list", auth(), bodyParser.urlencoded({ extended: false }), async (req, res) => {
  if (!req.user) return res.status(401).send({ status: "unauthorized", data: null });

  try {
    const todos = await todosModel.getTodos(req.query, req.user.id);
    res.status(200).send({ status: "ok", data: todos });
  } catch (err) {
    res.status(400).send({ status: "error", data: null });
  }
});

router.get("/list/count", auth(), async (req, res) => {
  if (!req.user) return res.status(401).send({ status: "unauthorized" });

  try {
    const todos = await todosModel.getTodos(req.user.id);
    res.status(200).send({ status: "ok", data: todos.length });
  } catch (err) {
    res.status(400).send({ status: "error", data: null });
  }
});

router.post("/create", auth(), async (req, res) => {
  if (!req.user) return res.status(401).send({ status: "unauthorized", data: null });

  try {
    const newTodo = await todosModel.createTodo(req.body, req.user.id);
    res.status(201).send({ status: "ok", data: newTodo });
  } catch (err) {
    res.status(400).send({ status: "error", ...err });
  }
});

router.put("/update/:id", auth(), async (req, res) => {
  if (!req.user) return res.status(401).send({ status: "unauthorized", data: null });

  try {
    const updatedTodo = await todosModel.updateTodo(req.params.id, req.body, req.user.id);
    res.status(200).send({ status: "ok", data: updatedTodo });
  } catch (err) {
    res.status(400).send({ status: "error", ...err });
  }
});

router.delete("/delete/:id", auth(), async (req, res) => {
  if (!req.user) return res.status(401).send({ status: "unauthorized" });

  try {
    const deletedTodo = await todosModel.deleteTodo(req.params.id, req.user.id);
    res.status(200).send({ status: "ok", data: deletedTodo });
  } catch (err) {
    res.status(400).send({ status: "error", ...err });
  }
});

module.exports = router;
