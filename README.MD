##### Запуск проекта

`npm start`

***

##### api

***

### `Auth`

`POST` `http://localhost:8080/api/auth/login`

```js
    const user = {
        username: "admin",
        password: "admin",
    };

    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
```

***

`POST` `http://localhost:8080/api/auth/login`

```js
    const user = {
        username: "admin",
        password: "admin",
    };

    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
```

api возвращает `sessionId`, который в дальнейшем нужно передавать в заголовке `Authorization`

***

`POST` `http://localhost:8080/api/auth/signup`

```js
  fetch("http://localhost:8080/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      username: "vlad",
      password: "vlad",
    }),
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

***

`GET` `http://localhost:8080/api/auth/logout`

```js
  fetch("http://localhost:8080/api/auth/logout", {
    method: "GET",
    headers: {
      Authorization: `sessionId` из запроса `http://localhost:8080/api/auth/login` или `http://localhost:8080/api/auth/signup`,
    },
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

***

#### `Todos`

***

`GET` `http://localhost:8080/api/todo/list`

```js
  fetch("http://localhost:8080/api/todo/list", {
    headers: {
      Authorization: `sessionId` из запроса `http://localhost:8080/api/auth/login` или `http://localhost:8080/api/auth/signup`
    },
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

доступные `query` параметры

```ts
    limit?: number
    title?: string
    completed?: boolean
```

пример с `query` параметрами

```js
  fetch("http://localhost:8080/api/todo/list?limit=3&title=title&completed=true", {
    headers: {
      Authorization: `sessionId` из запроса `http://localhost:8080/api/auth/login` или `http://localhost:8080/api/auth/signup`
    },
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

***

`GET` `http://localhost:8080/api/todo/count`

```js
  fetch("http://localhost:8080/api/todo/count", {
    headers: {
      Authorization: `sessionId` из запроса `http://localhost:8080/api/auth/login` или `http://localhost:8080/api/auth/signup`
    },
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```

***

`POST` `http://localhost:8080/api/todo/create`

```js
const todo = {
  "title": "title",
  "description": "description"
};

  fetch("http://localhost:8080/api/todo/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `sessionId` из запроса `http://localhost:8080/api/auth/login` или `http://localhost:8080/api/auth/signup`,
    },
    body: JSON.stringify(todo),
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```

***

`PUT` `http://localhost:8080/api/todo/update/:id`

```js
const todo = {
  "title": "title",
  "description": "description",
  "completed": true
};

  fetch("http://localhost:8080/api/todo/update/:id", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `sessionId` из запроса `http://localhost:8080/api/auth/login` или `http://localhost:8080/api/auth/signup`
    },
    body: JSON.stringify(todo),
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```

***

`DELETE` `http://localhost:8080/api/todo/delete/:id`

```js
fetch("http://localhost:8080/api/todo/delete/:id", {
  method: "DELETE",
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```
