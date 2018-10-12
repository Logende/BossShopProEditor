import Vue from 'vue';
import Vuex from 'vuex';
import _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        config: {} as object,
        selectedPath: ""
    },
    mutations: {
        applyConfig(state, { path, newValue }) {
            if (path === "/") {
                // set the root object
                state.config = newValue;
            } else {
                state.config = _.set(state.config, path, newValue);
            }
        },
        setSelectedPath(state, newPath) {
            state.selectedPath = newPath;
        }
    },
    actions: {

    },
});
