<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <button :class="{active:filter === 'all'}" @click="changeFilter('all')">모든 항목 ({{total}})</button>
        <button
          :class="{active:filter ==='active'}"
          @click="changeFilter('active')"
        >해야 할 항목 ({{activeCount}})</button>
        <button
          :class="{active: filter === 'completed'}"
          @click="changeFilter('completed')"
        >완료된 항목 ({{completedCount}})</button>
      </div>

      <div class="actions">
        <div class="float--left">
          <input v-model="allDone" type="checkbox" />
        </div>
        <div class="float--right">
          <button @click="clearCompleted">완료된 항목 삭제</button>
        </div>
      </div>
    </div>

    <div class="todo-app__list">
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
      />
    </div>
    <hr />
    <todo-creator class="todo-app__creator" @create-todo="createTodo" />
  </div>
</template>

<script>
import lowdb from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import cryptoRandomString from "crypto-random-string";
import _cloneDeep from "lodash/cloneDeep";
import _find from "lodash/find";
import _assign from "lodash/assign";
import _findIndex from "lodash/findIndex";
import _forEachRight from "lodash/forEachRight";
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
      filter: "all",
    };
  },

  computed: {
    filteredTodos() {
      switch (this.filter) {
        case "all":
        default:
          return this.todos;
        case "active": // 해야 할 항목
          return this.todos.filter((todo) => !todo.done);
        case "completed": // 완료된 항목
          return this.todos.filter((todo) => todo.done);
      }
    },

    total() {
      return this.todos.length;
    },
    activeCount() {
      return this.todos.filter((todo) => !todo.done).length;
    },
    completedCount() {
      return this.total - this.activeCount;
    },

    allDone: {
      get() {
        return this.total === this.completedCount && this.total > 0;
      },
      set(checked) {
        this.completeAll(checked);
      },
    },
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
      // Update DB
      this.db.get("todos").find({ id: todo.id }).assign(value).write();

      // Update Client
      const foundTodo = _find(this.todos, { id: todo.id });
      _assign(foundTodo, value);
    },
    deleteTodo(todo) {
      // Delete DB
      this.db.get("todos").remove({ id: todo.id }).write();

      // Delete Client
      const foundIndex = _findIndex(this.todos, { id: todo.id });
      this.$delete(this.todos, foundIndex);
    },

    changeFilter(filter) {
      this.filter = filter;
    },

    completeAll(checked) {
      // DB 갱신
      this.db
        .get("todos")
        .forEach((todo) => {
          todo.done = checked;
        })
        .write();

      // Local todos 갱신
      this.todos.forEach((todo) => {
        todo.done = checked;
      });
    },

    clearCompleted() {
      _forEachRight(this.todos, (todo) => {
        if (todo.done) {
          this.deleteTodo(todo);
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../scss/style";
</style>