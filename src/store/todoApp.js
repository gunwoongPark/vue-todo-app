import lowdb from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import cryptoRandomString from "crypto-random-string";
import _find from "lodash/find";
import _assign from "lodash/assign";

export default {
    namespaced: true,
    // Data
    // 참조 관계가 발생하지 않도록 함수형으로 작성
    state: () => ({
        db: null,
        todos: [],
    }),
    // Computed
    getters: {
        total(state) {
            return state.todos.length;
        },
        activeCount(state) {
            return state.todos.filter((todo) => !todo.done).length;
        },
        completedCount(getters) {
            return getters.total - getters.activeCount;
        },
    },
    // Methods
    // 실제 값을 변경할 때(비동기X)
    mutations: {
        assignDB(state, db) {
            state.db = db
        },
        createDB(state, newTodo) {
            state.db.get("todos").push(newTodo).write();
        },
        updateDB(state, { todo, value }) {
            state.db.get("todos").find({ id: todo.id }).assign(value).write();
        },
        assignTodos(state, todos) {
            state.todos = todos
        },
        pushTodo(state, newTodo) {
            state.todos.push(newTodo)
        },
        assignTodo(state, { foundTodo, value }) {
            _assign(foundTodo, value)
        }

    },
    // Methods
    // 일반 로직(비동기O)
    actions: {
        // context 를 거쳐서 state 및 commit 에 접근 가능
        initDB({ state, commit }) {
            const adapter = new LocalStorage("todo-app");
            commit('assignDB', lowdb(adapter))

            const hasTodos = state.db.has("todos").value();

            if (hasTodos) {
                commit('assignTodos', _cloneDeep(state.db.getState().todos))
            } else {
                // Local DB 초기화
                state.db
                    .defaults({
                        todos: [], // Collections
                    })
                    .write();
            }
        },
        createTodo({ state, commit }, newTitle) {
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title: newTitle,
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false,
            };

            // Create DB
            commit('createDB', newTodo)

            // Create Client
            commit('pushTodo', newTodo)
        },
        updateTodo({ state, commit }, { todo, value }) {
            // Update DB
            commit('updateDB', { todo, value })

            // Update Client
            const foundTodo = _find(state.todos, { id: todo.id });
            commit('assignTodo', { foundTodo, value })
        },
    }
}
