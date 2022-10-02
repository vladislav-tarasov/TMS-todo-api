##### Запуск проекта

`npm start`

***

##### api

***

`GET` `http://localhost:8080/api/todo/list`

```js
    fetch("http://localhost:8080/api/todo/list")
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
fetch("http://localhost:8080/api/todo/list?limit=3&title=title&completed=true")
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
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
  },
  body: JSON.stringify(todo),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```

***

`DELETE` `http://localhost:8080/api/todo/update/:id`

```js
fetch("http://localhost:8080/api/todo/delete/:id", {
  method: "DELETE",
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
```
