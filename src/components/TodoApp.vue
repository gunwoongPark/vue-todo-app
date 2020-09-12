<template>
  <div>
    <todo-item />
    <todo-creator />
  </div>
</template>

<script>
import lowdb from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import cryptoRandomString from "crypto-random-string";
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

      console.log(this.db);
      // Local DB 초기화
      this.db
        .defaults({
          todos: [], // Collections
        })
        .write();
    },
    createTodo(newTitle) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title: newTitle,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false,
      };

      this.db.get("todos").push(newTodo).write();
    },
  },
};
</script>