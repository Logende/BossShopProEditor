import Vue from 'vue';
import Vuex from 'vuex';
import _ from "lodash";
import { pathToString } from "@/pathHelper";
import { editorData } from '@/data/EditorData';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        config: {} as object,
        selectedPath: [],
    },
    getters: {
        pathString: (state) => pathToString(state.selectedPath),
        selectedType: (state) => editorData.getElementType(state.selectedPath, state.config)
    },
    mutations: {
        applyConfig(state, { path, newValue }) {
            const p = pathToString(path);
            if (!p) {
                // set the root object
                state.config = newValue;
            } else {
                // TODO: Replace this way of updating the config with a deep Vue.set function
                const newConfig = JSON.parse(JSON.stringify(state.config));
                _.set(newConfig, p, newValue);
                Vue.set(state, "config", newConfig);
            }
        },
        deleteConfig(state, path: string[]) {
            const parr = path.slice();
            const last = parr.pop()!;
            const p = pathToString(parr);
            if (p) {
                // @ts-ignore
                Vue.delete(_.at(state.config, p)[0], last);
            }
        },
        setSelectedPath(state, newPath) {
            state.selectedPath = newPath;
        }
    },
    actions: {

    }
});
