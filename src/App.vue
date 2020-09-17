<template>
  <div>
    <router-link to="/" class="to-home">
      <i class="material-icons">home</i>
    </router-link>

    <router-view />
  </div>
</template>

<style lang="scss">
// router-link-exact-active 는 vue 에서 제공하는 링크가 현재와 같을 경우 뜨는 클래스이다.
.to-home.router-link-exact-active {
  display: none;
}
</style>
