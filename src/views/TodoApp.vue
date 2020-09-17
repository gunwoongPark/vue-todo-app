<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <router-link to="all" tag="button">모든 항목 ({{total}})</router-link>
        <router-link to="active" tag="button">해야 할 항목 ({{activeCount}})</router-link>
        <router-link to="completed" tag="button">완료된 항목 ({{completedCount}})</router-link>
      </div>

      <div class="actions clearfix">
        <div class="float--left">
          <label>
            <input v-model="allDone" type="checkbox" />
            <span class="icon">
              <i class="material-icons">done_all</i>
            </span>
          </label>
        </div>
        <div class="float--right clearfix">
          <button class="btn float--left" @click="scrollToTop">
            <i class="material-icons">expand_less</i>
          </button>
          <button class="btn float--left" @click="scrollToBottom">
            <i class="material-icons">expand_more</i>
          </button>
          <button class="btn btn--danger float--left" @click="clearCompleted">
            <i class="material-icons">delete_sweep</i>
          </button>
        </div>
      </div>
    </div>

    <div class="todo-app__list">
      <todo-item v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
    </div>

    <todo-creator class="todo-app__creator" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import scrollTo from "scroll-to";
import TodoCreator from "../components/TodoCreator";
import TodoItem from "../components/TodoItem";

export default {
  components: {
    TodoCreator,
    TodoItem,
  },

  computed: {
    // Helpers
    ...mapState("todoApp", ["todos"]),
    ...mapGetters("todoApp", ["total", "activeCount", "completedCount"]),

    filteredTodos() {
      switch (this.$route.params.id) {
        case "all":
        default:
          return this.todos;
        case "active": // 해야 할 항목
          return this.todos.filter((todo) => !todo.done);
        case "completed": // 완료된 항목
          return this.todos.filter((todo) => todo.done);
      }
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
    // actions, mutations 의 파라미터가 두 개 이상일 경우 무시될 수 있어서 객체형태로 넘겨줌
    this.$store.dispatch("todoApp/updateTodo", { todo, value });
  },
  methods: {
    scrollToTop() {
      scrollTo(0, 0, {
        ease: "linear",
      });
    },

    scrollToBottom() {
      scrollTo(0, document.body.scrollHeight, {
        ease: "linear",
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../scss/style";

.filters button.router-link-active {
  background: royalblue;
  color: white;
}
</style>