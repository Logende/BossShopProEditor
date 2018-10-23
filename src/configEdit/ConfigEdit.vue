<template>
    <div class="ui container">
        <div class="column">
            <h1>Raw Shop Configuration</h1>
        </div>
        <div class="column">
            <v-progress-linear
             :color="color"
             height="20"
             value="100"
            >Text</v-progress-linear>
            <b v-if="!this.validYaml">Invalid YAML.</b>
        </div>
        <div class="column">
            <div class="field">
              <textarea outline auto-grow label="Paste your shop configuration file here or create a new shop" auto-focus style="width:100%;" @click="pushSelectionSafe()" @select="pushSelectionSafe()" @keydown="pushConfigSafe()" ref="configTextArea" v-model="configText"></textarea>
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
    private selectedPath: Array<string|number> = [];
    private functionUpdateSelectionSlow = _.debounce(this.pushSelection, 300);
    private functionUpdateSelectionFast = _.throttle(this.pushSelection, 200);
    private functionUpdateConfig = _.debounce(this.pushConfig, 300);
    private functionPullConfig = _.debounce(this.pullConfig, 700);
    private functionPullSelection = _.debounce(this.pullSelection, 50);

    private validYaml: boolean = true;


    private get color(): string {
        return this.validYaml ? "success" : "error";
    }



    
    private mounted(){
        const element = this.$refs.configTextArea as HTMLTextAreaElement;
        element.selectionStart = 0;
        element.selectionEnd = 0;
        this.pushConfig();
    }

    private pushSelectionSafe() {
            this.functionUpdateSelectionFast.call(this);
    }

    private pushConfig() {
        try{
            this.configObject = YAML.parse(this.configText);
            this.validYaml = true;
            const configObjectCopy = JSON.parse(JSON.stringify(this.configObject));
            this.$store.commit("applyConfig", { path: [], newValue: configObjectCopy });
            this.pushSelection();
        }catch(error){
            this.validYaml = false;
            return;
        }
    }

    private pushConfigSafe() {
            this.functionUpdateSelectionSlow.call(this);
            this.functionUpdateConfig.call(this);
    }

    private pushSelection() {
        const element = this.$refs.configTextArea as HTMLTextAreaElement;
        const endPosition = element.selectionEnd;
        this.selectedPath = manipulator.getPath(this.configText, endPosition);
        this.$store.commit("setSelectedPath", this.selectedPath);
    }

    @Watch("$store.state.config", { deep: true })
    private pullConfigSafe() {
        this.pullConfig.call(this);
    }

    private pullConfig() {
        if (this.$store.state.config === this.configObject) {
            return;
        }
        const configObjectCopy = JSON.parse(JSON.stringify(this.$store.state.config));
        this.configObject = configObjectCopy;
        const configText = YAML.stringify(this.configObject, 100, 2);
        if (configText === this.configText) {
            return;
        }
        this.configText = configText;
    }

    @Watch("$store.state.selectedPath")
    private pullSelectionSafe() {
        this.functionPullSelection.call(this);
    }

    private pullSelection() {
        if (this.$store.state.selectedPath === this.selectedPath) {
            return;
        }
        const indexLine = manipulator.getIndex(this.configText, this.$store.state.selectedPath);
        if (indexLine !== -1) {
            this.selectedPath = this.$store.state.selectedPath;
            const element = this.$refs.configTextArea as HTMLTextAreaElement;
            element.selectionEnd = indexLine;
            element.selectionStart = indexLine;
        }
    }

}
</script>
