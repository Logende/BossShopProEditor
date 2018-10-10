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
              <textarea v-model="configText"></textarea>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import YAML from 'yamljs';
import Component from 'vue-class-component';
@Component
export default class ConfigEdit extends Vue {
    private configText: string = "";
    private configObject: object = {};
    private convertToYaml() {
        this.configObject = YAML.parse(this.configText);
        console.log(this.configObject);
    }
}
</script>