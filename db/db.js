const crypto = require("crypto");
const yup = require("yup");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");

class DB {
  static hash = (password) => crypto.pbkdf2Sync(password, "salt", 100000, 64, "sha512").toString("hex");

  static async init() {
    try {
      await DB.getData();
    } catch (err) {
      DB.writeData({
        todos: {},
        users: [{ id: uuidv4(), username: "admin", password: DB.hash("admin") }],
        sessions: {},
      });
    }
  }

  static async getData() {
    return fs.readFile(path.resolve(__dirname, "./db.json"), "utf8").then(JSON.parse);
  }

  static async writeData(nextData) {
    return fs.writeFile(path.resolve(__dirname, "./db.json"), JSON.stringify(nextData));
  }
}

class AuthModel {
  async createUser(name, password) {
    const data = await DB.getData();

    const newUser = {
      id: uuidv4(),
      name,
      password: DB.hash(password),
    };

    data.users.push(newUser);

    await DB.writeData(data);
    return newUser;
  }

  async createSession(userId) {
    const data = await DB.getData();
    const sessionId = uuidv4();

    data.sessions[sessionId] = userId;

    await DB.writeData(data);
    return sessionId;
  }

  async deleteSession(sessionId) {
    const data = await DB.getData();
    delete data.sessions[sessionId];

    await DB.writeData(data);
  }

  async getUserByName(name) {
    const data = await DB.getData();
    return data.users.find(({ username }) => username === name);
  }

  async getUserBySessionId(id) {
    const data = await DB.getData();

    const userId = data.sessions[id];

    if (userId) {
      return data.users.find((user) => user.id === userId);
    }
  }
}

class TodosModel {
  async get({ title, completed, limit } = {}, userId) {
    const data = await DB.getData();
    let todos = data.todos[userId] ?? [];

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

  async add(todo, userId) {
    const data = await DB.getData();

    const newTodo = {
      ...todo,
      id: uuidv4(),
      completed: false,
      createAt: Date.now(),
      updatedAt: null,
    };

    (data.todos[userId] = data.todos[userId] || []).push(newTodo);

    await DB.writeData(data);

    return newTodo;
  }

  async update(todoId, todo, userId) {
    if (!userId) {
      throw new Error({ message: "invalid userId" });
    }

    const data = await DB.getData();

    const todoIndex = data.todos[userId].findIndex((todo) => todo.id === todoId);

    if (todoIndex < 0 || !todoId) {
      throw new Error({ message: "invalid id" });
    }

    const updatedTodo = {
      ...data.todos[userId][todoIndex],
      ...todo,
      updatedAt: Date.now(),
    };

    data.todos[userId].splice(todoIndex, 1, updatedTodo);
    await DB.writeData(data);

    return updatedTodo;
  }

  async delete(todoId, userId) {
    const data = await DB.getData();

    const todoIndex = data.todos[userId].findIndex((todo) => todo.id === todoId);

    if (todoIndex < 0 || !todoId) {
      throw new Error({ message: "invalid id" });
    }

    const [deletedTodo] = data.todos[userId].splice(todoIndex, 1);
    await DB.writeData(data);

    deletedTodo;
  }
}

class Todos {
  todosModel = new TodosModel();

  createTodoSchema = yup.object({
    title: yup.string().required("title required").max(20, "max length 20"),
    description: yup.string().max(200, "max length 200"),
  });

  updateTodoSchema = yup.object({
    title: yup.string().max(20, "max length 20"),
    description: yup.string().max(200, "max length 200"),
    completed: yup.boolean(),
  });

  static formatValidationError(error) {
    return error?.inner?.reduce((errors, field) => ({ ...errors, [field.path]: field.errors }), {}) ?? null;
  }

  async getTodos(query, userId) {
    return this.todosModel.get(query, userId);
  }

  async createTodo(todo, userId) {
    let validatedTodo;

    try {
      validatedTodo = await this.createTodoSchema.validate(todo, { abortEarly: false });
    } catch (err) {
      throw new Error({
        message: "validation error",
        data: Todos.formatValidationError(err),
      });
    }

    const newTodo = await this.todosModel.add(validatedTodo, userId);
    return newTodo;
  }

  async updateTodo(todoId, todo, userId) {
    let validatedTodo;

    try {
      validatedTodo = await this.updateTodoSchema.validate(todo, { abortEarly: false });
    } catch (err) {
      throw new Error({
        message: "validation error",
        data: Todos.formatValidationError(err),
      });
    }

    const updatedTodo = await this.todosModel.update(todoId, validatedTodo, userId);
    return updatedTodo;
  }

  async deleteTodo(todoId, userId) {
    const deletedTodo = await this.todosModel.delete(todoId, userId);
    return deletedTodo;
  }
}

module.exports = { todosModel: new Todos(), authModel: new AuthModel(), DB };
