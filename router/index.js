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
        // 특정 페이지에서 보여줄게 없을경우 redirect 속성에 적힌 url 로 다시 보낸다.
        redirect: '/todos/all',
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