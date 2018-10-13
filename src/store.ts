import Vue from 'vue';
import Vuex from 'vuex';
import _ from "lodash";
import { pathToString } from "@/pathHelper";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        config: {} as object,
        selectedPath: [],
    },
    getters: {
        pathString: (state) => pathToString(state.selectedPath),
        selectedType: (state) => {
            // TODO: Determine type from state.selectedPath and state.config
        }
    },
    mutations: {
        applyConfig(state, { path, newValue }) {
            const p = pathToString(path);
            if (!p) {
                // set the root object
                state.config = newValue;
            } else {
                state.config = _.set(state.config, p, newValue);
            }
        },
        setSelectedPath(state, newPath) {
            state.selectedPath = newPath;
        }
    },
    actions: {

    }
});
