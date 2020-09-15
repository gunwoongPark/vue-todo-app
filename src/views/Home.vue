<template>
  <section class="home">
    <div>
      <h1>gunwoongPark's Home page!</h1>
      <h2 @click="toAbout">About</h2>
      <h2 @click="toTodoApp">Todo App</h2>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    toAbout() {
      this.$router.push("/about");
    },
    toTodoApp() {
      this.$router.push("/todos");
    },
  },
};
</script>