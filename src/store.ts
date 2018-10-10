import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        config: {} as object,
        selectedPath: ""
    },
    mutations: {
        applyConfig(state, { path, value }) {
            // TODO
        },
        setSelectedPath(state, newPath) {
            state.selectedPath = newPath;
        }
    },
    actions: {

    },
});
