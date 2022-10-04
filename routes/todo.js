const router = require("express").Router();

const { todosModel } = require("../db/db");

router.get("/list", async (req, res) => {
  try {
    const todos = await todosModel.getTodos(req.query);
    res.status(200).send({ status: "ok", data: todos });
  } catch (err) {
    res.status(400).send({ status: "error", data: null });
  }
});

router.get("/list/count", async (req, res) => {
  try {
    const todos = await todosModel.getTodos();
    res.status(200).send({ status: "ok", data: todos.length });
  } catch (err) {
    res.status(400).send({ status: "error", data: null });
  }
});

router.post("/create", async (req, res) => {
  try {
    const newTodo = await todosModel.createTodo(req.body);
    res.status(201).send({ status: "ok", data: newTodo });
  } catch (err) {
    res.status(400).send({ status: "error", ...err });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedTodo = await todosModel.updateTodo(req.params.id, req.body);
    res.status(200).send({ status: "ok", data: updatedTodo });
  } catch (err) {
    res.status(400).send({ status: "error", ...err });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedTodo = await todosModel.deleteTodo(req.params.id);
    res.status(200).send({ status: "ok", data: deletedTodo });
  } catch (err) {
    res.status(400).send({ status: "error", ...err });
  }
});

module.exports = router;
