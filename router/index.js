import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../src/views/Home'
import About from '../src/views/About'
import TodoApp from '../src/views/TodoApp'

Vue.use(VueRouter)

const routes = [
    // config
    {
        name: 'index',
        path: '/',
        component: Home
    },
    {
        name: 'about',
        path: '/about',
        component: About
    },
    {
        name: 'todos',
        path: '/todos',
        component: TodoApp,
        children: [
            {
                name: 'todos-filter',
                path: ':id'
            }
        ]
    }
]

export default new VueRouter({
    routes
})