<template>
    <div>
        <h1 class="mb-3">QuickEdit Section</h1>

        <v-form v-if="editableProperties.length > 0">
            <h3 class="mb-2">Path: {{ selectedPath }}</h3>
            <qe-property
                v-for="p in editableProperties"
                :key="p.configKey"
                :type="p.type"
                :name="p.configKey"
                :value="getValue(p.configKey)"
                @input="update(p.configKey, $event)"
                @change-path="changePath(p.configKey, $event)"
            ></qe-property>
        </v-form>

        <v-alert v-else :value="true" type="info">This property is not supported.</v-alert>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import _ from "lodash";
import { IElementType, ElementTypeClass, IElementTypeComplex } from "@/data/ElementTypeModel";
import { elementTypes } from "@/data/ElementTypes";
import exampleConfig from "@/data/exampleConfig";
import Property from "./properties/Property";
import { pathToString } from "@/pathHelper";

@Component({
    components: {
        "qe-property": Property
    }
})
export default class QuickEdit extends Vue {

    bt = elementTypes.get("shop");

    get editableProperties() {
        return (this.bt && this.bt.class === ElementTypeClass.Complex) ?
            (this.bt as IElementTypeComplex).properties :
            [];
    }

    get selectedPath(): string {
        return this.$store.getters.pathString;
    }

    mounted(): void {
        this.$store.commit("applyConfig", {
            path: [],
            newValue: exampleConfig
        });
        this.$store.commit("setSelectedPath", []);
    }

    getValue(key: string): any {
        const path = pathToString(this.$store.state.selectedPath.concat([key])) || "";
        return _.at(this.$store.state.config, [path])[0];
    }

    update(path: string, newValue: any): void {
        this.$store.commit("applyConfig", {
            path: this.$store.state.selectedPath.concat([path]),
            newValue
        })
        this.$emit("change-request", { path, newValue });
    }

    changePath(base: string, payload: string[]) {
        const p = [base];
        if (payload) { p.push(...payload); }
        this.$store.commit("setSelectedPath", this.$store.state.selectedPath.concat(p));
        // TODO: Remove after debug
        this.bt = elementTypes.get("shopitem");
    }

}
</script>
