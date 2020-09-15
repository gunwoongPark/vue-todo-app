import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../src/views/Home.vue'
import About from '../src/views/About.vue'
import TodoApp from '../src/views/TodoApp'

Vue.use(VueRouter)

const routes = [
    // config
    {
        path: '/',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/todos',
        component: TodoApp
    }
]

export default new VueRouter({
    routes
})