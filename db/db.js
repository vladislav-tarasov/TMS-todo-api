const yup = require("yup");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");

class DB {
  static async init() {
    try {
      await DB.getData();
    } catch (err) {
      DB.writeData({ todos: [] });
    }
  }

  static async getData() {
    return fs.readFile(path.resolve(__dirname, "./db.json"), "utf8").then(JSON.parse);
  }

  static async writeData(nextData) {
    return fs.writeFile(path.resolve(__dirname, "./db.json"), JSON.stringify(nextData));
  }
}

class TodosDB {
  async get({ title, completed, limit } = {}) {
    let { todos = [] } = await DB.getData();

    if (completed) {
      todos = todos.filter((todo) => String(todo.completed) === completed);
    }

    if (title) {
      todos = todos.filter((todo) => todo.title.includes(title));
    }

    if (limit) {
      todos = todos.slice(0, Number(limit));
    }

    return todos;
  }

  async add(todo) {
    const data = await DB.getData();

    const newTodo = {
      ...todo,
      id: uuidv4(),
      completed: false,
      createAt: Date.now(),
      updatedAt: null,
    };

    data.todos.push(newTodo);

    await DB.writeData(data);

    return newTodo;
  }

  async update(todoId, todo) {
    const data = await DB.getData();

    const todoIndex = data.todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex < 0 || !todoId) {
      throw Error({ message: "invalid id" });
    }

    const updatedTodo = {
      ...data.todos[todoIndex],
      ...todo,
      updatedAt: Date.now(),
    };

    data.todos.splice(todoIndex, 1, updatedTodo);
    await DB.writeData(data);

    return updatedTodo;
  }

  async delete(todoId) {
    const data = await DB.getData();

    const todoIndex = data.todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex < 0 || !todoId) {
      throw Error({ message: "invalid id" });
    }

    const [deletedTodo] = data.todos.splice(todoIndex, 1);
    await DB.writeData(data);

    deletedTodo;
  }
}

class Todos {
  todosDB = new TodosDB();

  createTodoSchema = yup.object({
    title: yup.string().required("title required").max(20, "max length 20"),
    description: yup.string().max(200, "max length 200"),
  });

  updateTodoSchema = yup.object({
    title: yup.string().required("title required").max(20, "max length 20"),
    description: yup.string().max(200, "max length 200"),
    completed: yup.boolean().required("completed required"),
  });

  static formatValidationError(error) {
    return error?.inner?.reduce((errors, field) => ({ ...errors, [field.path]: field.errors }), {}) ?? null;
  }

  async getTodos(query) {
    return this.todosDB.get(query);
  }

  async createTodo(todo) {
    let validatedTodo;

    try {
      validatedTodo = await this.createTodoSchema.validate(todo, { abortEarly: false });
    } catch (err) {
      return {
        message: "validation error",
        data: Todos.formatValidationError(err),
      };
    }

    const newTodo = await this.todosDB.add(validatedTodo);
    return newTodo;
  }

  async updateTodo(todoId, todo) {
    let validatedTodo;

    try {
      validatedTodo = await this.updateTodoSchema.validate(todo, { abortEarly: false });
    } catch (err) {
      return {
        message: "validation error",
        data: Todos.formatValidationError(err),
      };
    }

    const updatedTodo = await this.todosDB.update(todoId, validatedTodo);
    return updatedTodo;
  }

  async deleteTodo(todoId) {
    const deletedTodo = await this.todosDB.delete(todoId);
    return deletedTodo;
  }
}

module.exports = { todosDB: new Todos(), DB };
