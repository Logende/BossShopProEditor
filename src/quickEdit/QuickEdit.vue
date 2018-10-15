<template>
    <div>
        <h1 class="mb-3">QuickEdit Section</h1>

        <v-breadcrumbs>
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item @click.native="navigate(0)">Root</v-breadcrumbs-item>
            <v-breadcrumbs-item
                v-for="(p, i) in basePath"
                :key="i"
                @click.native="navigate(i + 1)"
            >{{ p }}</v-breadcrumbs-item>
        </v-breadcrumbs>

        <v-form v-if="editableProperties.length > 0">
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
import { editorData } from '@/data/EditorData';

@Component({
    components: {
        "qe-property": Property
    }
})
export default class QuickEdit extends Vue {

    isParentPath = false;

    get basePath() {
        return (this.isParentPath) ?
            this.$store.state.selectedPath.slice(0, -1) :
            this.$store.state.selectedPath;
    }

    get editableProperties() {
        let type = this.$store.getters.selectedType;
        if (!type) { return []; }

        if (type.class === ElementTypeClass.Simple) {
            type = editorData.getElementType(
                this.$store.state.selectedPath.slice(0, -1),
                this.$store.state.config);
            this.isParentPath = true;
        } else {
            this.isParentPath = false;
        }

        return (type && type.class === ElementTypeClass.Complex) ?
            (type as IElementTypeComplex).properties :
            [];
    }

    get selectedPath(): string {
        return this.$store.getters.pathString;
    }

    getValue(key: string): any {
        const path = pathToString(this.basePath.concat([key])) || "";
        return _.at(this.$store.state.config, [path])[0];
    }

    update(path: string, newValue: any): void {
        this.$store.commit("applyConfig", {
            path: this.basePath.concat([path]),
            newValue
        });
        this.$emit("change-request", { path, newValue });
    }

    changePath(base: string, payload: string[]) {
        const p = [base];
        if (payload) { p.push(...payload); }
        this.$store.commit("setSelectedPath", this.$store.state.selectedPath.concat(p));
    }

    navigate(index: number) {
        const length = this.$store.state.selectedPath.length;
        this.$store.commit("setSelectedPath", this.$store.state.selectedPath.slice(0, index - length));
    }

}
</script>
