<template>
<div>
        <h1 class="mb-3">Shop Configuration</h1>
            <v-alert
             :type="color"
             :value="!validYaml"
            >{{errorMessage}}</v-alert>
            <div class="field">
              <textarea
                class="editarea"
                @click="pushSelectionSafe()"
                @select="pushSelectionSafe()"
                @keydown="pushConfigSafe()"
                ref="configTextArea"
                v-model="configText"
              ></textarea>
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
    private commentLines = new Map<string, string[]>(); // Key: path; Value: Array of comments below that path
    private selectedPath: Array<string|number> = [];
    private functionUpdateSelectionSlow = _.debounce(this.pushSelection, 300);
    private functionUpdateSelectionFast = _.throttle(this.pushSelection, 200);
    private functionUpdateConfig = _.debounce(this.pushConfig, 300);
    private functionPullConfig = _.debounce(this.pullConfig, 700);
    private functionPullSelection = _.debounce(this.pullSelection, 50);

    private validYaml: boolean = true;
    private errorMessage: string = "";


    private get color(): string {
        return this.validYaml ? "success" : "error";
    }

    private mounted() {
        const element = this.$refs.configTextArea as HTMLTextAreaElement;
        element.selectionStart = 0;
        element.selectionEnd = 0;
        this.pushConfig();
    }

    private pushSelectionSafe() {
            this.functionUpdateSelectionFast.call(this);
    }

    private pushConfig() {
        try {
            // check whether path duplicates exist
            const pathDuplicate = manipulator.getPathDuplicate(this.configText);
            if (pathDuplicate !== undefined) {
                this.errorMessage = "Duplicate paths."
                this.validYaml = false;
                return;
            }

            // check whether valid yaml
            this.configObject = YAML.parse(this.configText);
            this.validYaml = true;
            this.errorMessage = "Your shop looks good."

            // copy, commit and push
            const configObjectCopy = JSON.parse(JSON.stringify(this.configObject));
            this.commentLines = manipulator.readCommentLines(this.configText);
            this.$store.commit("applyConfig", { path: [], newValue: configObjectCopy });
            this.pushSelection();
        } catch (error) {
            this.errorMessage = "Not valid YAML syntax."
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
        if (_.isEqual(this.$store.state.config, this.configObject)) {
            return;
        }
        const configObjectCopy = JSON.parse(JSON.stringify(this.$store.state.config));
        this.configObject = configObjectCopy;
        const configText = YAML.stringify(this.configObject, 100, 2);
        if (configText === this.configText) {
            return;
        }
        this.configText = manipulator.writeCommentLines(configText, this.commentLines);
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

<style>
.editarea {
    font-family: monospace;
    width: 100%;
    min-height: 600px;
}
</style>
