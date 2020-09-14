<template>
  <div>
    <todo-item
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @update-todo="updateTodo"
      @delete-todo="deleteTodo"
    />
    <hr />
    <todo-creator @create-todo="createTodo" />
  </div>
</template>

<script>
import lowdb from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import cryptoRandomString from "crypto-random-string";
import _cloneDeep from "lodash/cloneDeep";
import _find from "lodash/find";
import _assign from "lodash/assign";
import TodoCreator from "./TodoCreator";
import TodoItem from "./TodoItem";

export default {
  components: {
    TodoCreator,
    TodoItem,
  },
  data() {
    return {
      db: null,
      todos: [],
    };
  },
  created() {
    this.initDB();
    console.log(typeof this.db);
  },
  methods: {
    initDB() {
      const adapter = new LocalStorage("todo-app");
      this.db = lowdb(adapter);

      const hasTodos = this.db.has("todos").value();

      if (hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos);
      } else {
        // Local DB 초기화
        this.db
          .defaults({
            todos: [], // Collections
          })
          .write();
      }
    },
    createTodo(newTitle) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title: newTitle,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false,
      };

      // Create DB
      this.db.get("todos").push(newTodo).write();

      // Create Client
      this.todos.push(newTodo);
    },
    updateTodo(todo, value) {
      this.db.get("todos").find({ id: todo.id }).assign(value).write();

      const foundTodo = _find(this.todos, { id: todo.id });
      _assign(foundTodo, value);
    },
    deleteTodo() {
      console.log("Delete todo!");
    },
  },
};
</script>