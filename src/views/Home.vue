<template>
  <section class="home">
    <div>
      <h1>gunwoongPark's Home page!</h1>
      <!-- tag 속성은 vue 에서 제공하는 어떤 태그로 보였으면 좋겠는지 정하는 기능 -->
      <router-link tag="h2" to="/about">About</router-link>
      <router-link tag="h2" to="/todos">Todo App</router-link>
    </div>
  </section>
</template>