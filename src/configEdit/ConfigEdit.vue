<template>
<div>
    <h1 class="mb-3">Shop Configuration</h1>
    
            <v-btn flat icon color="white" @click="undo()" v-if="true/*canUndo()*/">
              <v-icon>undo</v-icon>
            </v-btn>
            <v-btn flat icon color="grey" v-else>
              <v-icon>undo</v-icon>
            </v-btn>

            <v-btn flat icon color="white" @click="redo()" v-if="true/*canRedo()*/">
              <v-icon>redo</v-icon>
            </v-btn>
            <v-btn flat icon color="grey" v-else>
              <v-icon>redo</v-icon>
            </v-btn>
    <v-alert
     :type="color"
     :value="!validYaml"
    >{{errorMessage}}</v-alert>
    <div class="field">
    <div id="editor" class="editor editarea"
    @click="pushSelectionSafe()"
    @select="pushSelectionSafe()"
    @keydown="pushConfigSafe()"
    ref="configTextArea"
    >{{ exampleConfigText }}</div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import YAML from 'js-yaml';
import Component from 'vue-class-component';
import _ from 'lodash';
import { manipulator } from "@/configEdit/ConfigManipulator";
import { manipulatorAce } from "@/configEdit/ConfigManipulatorAce";
import { editorData } from '@/data/EditorData';
import exampleConfigText from '@/data/bsp/config.yml';
import { Watch } from 'vue-property-decorator';

import * as ace from 'brace';
import 'brace/mode/yaml';
import 'brace/theme/monokai';

@Component
export default class ConfigEdit extends Vue {

    // TODO: WATCH changes of editor#session#undomanager to adapt undo/redo button color

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
    private externalChanges: boolean = false;


    private get color(): string {
        return this.validYaml ? "success" : "error";
    }

    private get editor(): ace.Editor {
        return ace.edit('editor');
    }

    private configText(): string {
        return this.editor.getValue();
    }
    private get exampleConfigText(): string {
        return exampleConfigText;
    }




    private mounted() {
        const editor = this.editor;
        editor.$blockScrolling = Infinity;
        editor.setPrintMarginColumn(-1);
        editor.getSession().setMode('ace/mode/yaml');
        editor.setTheme('ace/theme/monokai');
        const configEdit = this;
        editor.on('focus', () => {
            this.externalChanges = false;
        });
        editor.getSession().on('change', () => {
            configEdit.pushConfigSafe();
        });
        editor.on('mousedown', () => {
            configEdit.pushSelectionSafe();
        });
        this.pushConfig();
    }

    private pushSelectionSafe() {
        if (!this.externalChanges) {
            this.functionUpdateSelectionFast.call(this);
        }
    }

    private pushConfig() {
        try {
            // check whether path duplicates exist
            const pathDuplicate = manipulatorAce.getPathDuplicate(this.editor);
            if (pathDuplicate !== undefined) {
                this.errorMessage = "Duplicate config keys: '" + pathDuplicate + "'.";
                this.validYaml = false;
                return;
            }

            // check whether valid yaml
            this.configObject = YAML.safeLoad(this.configText());
            this.validYaml = true;
            this.errorMessage = "Your shop looks good.";

            // copy, commit and push
            const configObjectCopy = JSON.parse(JSON.stringify(this.configObject));
            this.commentLines = manipulator.readCommentLines(this.editor.getValue());
            this.$store.commit("applyConfig", { path: [], newValue: configObjectCopy });
            this.pushSelection();
        } catch (error) {
            this.errorMessage = "Not valid YAML syntax.";
            this.validYaml = false;
            return;
        }
    }

    private pushConfigSafe() {
        if (!this.externalChanges) {
            this.functionUpdateConfig.call(this);
        }
    }

    private pushSelection() {
        this.selectedPath = manipulatorAce.getPath(this.editor, this.editor.getCursorPosition());
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
        let configText = YAML.safeDump(this.configObject, {indent: 2, flowLevel: -1});
        configText = configText.substring(0, configText.length - 1);
        if (configText === this.configText()) {
            return;
        }
        this.externalChanges = true;
        this.editor.setValue(manipulator.writeCommentLines(configText, this.commentLines), -1);
    }

    @Watch("$store.state.selectedPath")
    private pullSelectionSafe() {
        this.functionPullSelection.call(this);
    }

    private pullSelection() {
        if (this.$store.state.selectedPath === this.selectedPath) {
            return;
        }
        const pos = manipulatorAce.getPos(this.editor, this.$store.state.selectedPath);
        if (pos.row !== -1) {
            this.editor.gotoLine(pos.row + 1);
            this.editor.setHighlightActiveLine(true);
        }
    }

    private undo() {
        this.editor.undo();
    }

    private redo() {
        this.editor.redo();
    }


    // not working yet: It seems like Vue does not update those computed properties
    // probably because it does not track changes of the Editor#session#undomanager object.

    private get canUndo(): boolean {
        if (!document.getElementById("editor")) {
            return false;
        }
        return this.editor.getSession().getUndoManager().hasUndo();
    }

    private get canRedo(): boolean {
        if (!document.getElementById("editor")) {
            return false;
        }
        return this.editor.getSession().getUndoManager().hasRedo();
    }

}
</script>

<style>
.editarea {
    width: 100%;
    min-height: 600px;
}

.ace-monokai .ace_gutter {
    background-color: #191919 !important;
}

.ace-monokai {
    background-color: #212121 !important;
}
</style>
