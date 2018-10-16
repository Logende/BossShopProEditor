<template>
    <div class="ui container">
        <div class="column">
            <h1>Raw Shop Configuration</h1>
        </div>
        <div class="column">
            <div class="field">
              <textarea outline auto-grow label="Paste your shop configuration file here or create a new shop" auto-focus style="width:100%;" @click="updateSelectionSafe()" @select="updateSelectionSafe()" @keydown="updateConfigSafe()" ref="configTextArea" v-model="configText"></textarea>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import YAML from 'yamljs';
import Component from 'vue-class-component';
import _ from 'lodash';
import { manipulator } from "@/configEdit/ConfigManipulator";
import { editorData } from '@/data/EditorData';
import exampleConfigText from '@/data/exampleConfigText';
import { Watch } from 'vue-property-decorator';

@Component
export default class ConfigEdit extends Vue {

    private configText: string = exampleConfigText;
    private configObject: object = {};
    private functionUpdateSelectionSlow = _.debounce(this.updateSelection, 300);
    private functionUpdateSelectionFast = _.throttle(this.updateSelection, 200);
    private functionUpdateConfig = _.debounce(this.updateConfig, 300);
    private functionUpdateConfigText = _.debounce(this.updateConfigText, 1000);

    public selectPath(path: string) {
        const element = this.$refs.configTextArea as HTMLTextAreaElement;
        const index = manipulator.getIndex(this.configText, path);
        element.selectionEnd = index;
        element.selectionStart = index;
    }


    private updateSelectionSafe() {
            this.functionUpdateSelectionFast.call(this);
    }
    
    private updateConfigSafe() {
            this.functionUpdateSelectionSlow.call(this);
            this.functionUpdateConfig.call(this);
    }
    
    private updateConfig() {
        this.configObject = YAML.parse(this.configText);
        console.log("updated config. apply config");
        this.$store.commit("applyConfig", { path: [], newValue: this.configObject });
        this.updateSelection();
    }

    private updateSelection() {
        const element = this.$refs.configTextArea as HTMLTextAreaElement;
        const endPosition = element.selectionEnd;
        const path = manipulator.getPath(this.configText, endPosition);
        this.$store.commit("setSelectedPath", path);
    }

    @Watch("$store.state.config", { deep: true })
    private updateConfigTextSafe() {
        console.log("updated config. update config text safe");
        this.functionUpdateConfigText.call(this);
    }

    private updateConfigText() {
        if (this.$store.state.config === this.configObject) {
            console.log("not updating config text: same config object");
            return;
        }
        const configText = YAML.stringify(this.$store.state.config, 100, 2);
        if (configText === this.configText) {
            console.log("not updating config text: same text");
            return;
        }
        console.log("new config text");
        this.configText = configText;
    }


}
</script>
