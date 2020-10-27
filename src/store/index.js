import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    // 定义变量的地方
    state:{
        routes: []
    },
    // 类似java中setter方法
    mutations: {
        initRoutes(state, data) {
            state.routes = data;
        }
    },
    // 提交的是mutation，包含任意异步操作
    actions:{

    }
})
