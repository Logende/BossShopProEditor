<template>
    <div class="ui container">
        <div class="column">
            <h1>Raw Configuration</h1>
        </div>
        <div class="column">
            <button @click="convertToYaml()">Convert (just for test reasons)</button>
        </div>
        <div class="column">
            <div class="field">
              <textarea @click="updateSelectionSafe(false)" @select="updateSelectionSafe(false)" @keydown="updateSelectionSafe(true)" ref="configTextArea" v-model="configText"></textarea>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import YAML from 'yamljs';
import Component from 'vue-class-component';
import _ from 'lodash';

@Component
export default class ConfigEdit extends Vue{

    private configText: string = "";
    private configObject: object = {};

    private functionUpdateSelectionSlow = _.debounce(this.updateSelection, 1000);
    private functionUpdateSelectionFast = _.throttle(this.updateSelection, 600);

    private convertToYaml(){
        this.configObject = YAML.parse(this.configText);
        console.log(this.configObject);
    }

    private updateSelectionSafe(slowUpdate: boolean){
        if(slowUpdate){            
            this.functionUpdateSelectionSlow.call(this);
        }else{
            this.functionUpdateSelectionFast.call(this);
        }
    }


    private updateSelection(){
        let element = this.$refs.configTextArea as HTMLTextAreaElement;
        let endPosition = element.selectionEnd;
        console.log("selection end: " + endPosition)
    }

}
</script>
