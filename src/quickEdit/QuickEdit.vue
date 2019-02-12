<template>
    <div>
        <h1 class="mb-3">Configuration Assistant</h1>

        <v-breadcrumbs :items="breadcrumbsItems" class="pl-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item slot="item" slot-scope="{ item }" @click.native="navigate(item.index)">
                {{ item.name }}
            </v-breadcrumbs-item>
        </v-breadcrumbs>

        <v-btn block color="red" class="ml-0 mb-3" v-show="type.deleteable" @click="remove">
            <v-icon>delete</v-icon>
            Delete
        </v-btn>

        <v-divider class="mb-3"></v-divider>

        <v-form v-if="editableProperties.length > 0">
            <qe-property
                v-for="p in editableProperties"
                :key="p.configKey"
                :type="p.resolvedType"
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import _ from "lodash";
import { IElementType, ElementTypeClass, IElementTypeComplex, IElementTypeProperty, IElementTypeSimpleAutocompleteDependency } from "@/data/ElementTypeModel";
import { elementTypes } from "@/data/ElementTypes";
import Property from "./properties/Property";
import { pathToString } from "@/pathHelper";
import { editorData } from '@/data/EditorData';

@Component({
    components: {
        "qe-property": Property
    }
})
export default class QuickEdit extends Vue {

    editableProperties: IElementTypeProperty[] = [];

    get path(): Array<string|number> {

        let p = this.$store.state.selectedPath;
        const config = this.$store.state.config;
        let foundValidPath = false;

        while (!foundValidPath && p.length > 0) {
            const type = editorData.getElementType(p, config);
            if (type && type.class === ElementTypeClass.Complex) {
                foundValidPath = true;
            } else {
                p = p.slice(0, -1);
            }
        }

        return p;

    }

    get type() {
        return editorData.getElementType(this.path, this.$store.state.config);
    }

    get selectedPath(): string {
        return this.$store.getters.pathString;
    }

    get breadcrumbsItems() {
        return [{ name: "Root", index: 0 }]
            .concat(this.path.map((p, i) => ({ name: p.toString(), index: i + 1 })));
    }

    @Watch("type", { immediate: true })
    @Watch("$store.state.config", { deep: true })
    updateEditableProperties() {
        if (this.type && this.type.class === ElementTypeClass.Complex) {
            const config = this.$store.state.config;
            this.editableProperties = (this.type as IElementTypeComplex).properties
                .map((prop: any) => {
                    prop.resolvedType = editorData.getElementType(this.path.concat([prop.configKey]), config);
                    return prop;
                });
        } else {
            this.editableProperties = [];
        }
    }

    getValue(key: string): any {
        const path = pathToString(this.path.concat([key])) || "";
        return _.at(this.$store.state.config, [path])[0];
    }

    update(path: string, newValue: any): void {
        const propertyPath = this.path.concat([path]);
        const type = editorData.getElementType(propertyPath, this.$store.state.config);
        if (type && (type as any).dependentConfigKey) {
            this.$store.commit("applyConfig", {
                path: this.path.concat([ (type as IElementTypeSimpleAutocompleteDependency).dependentConfigKey ]),
                newValue: undefined
            });
        }
        this.$store.commit("applyConfig", {
            path: propertyPath,
            newValue
        });
    }

    changePath(base: string, payload: string[]) {
        const p = [base];
        if (payload) { p.push(...payload); }
        this.$store.commit("setSelectedPath", this.path.concat(p));
    }

    navigate(index: number) {
        const length = this.path.length;
        this.$store.commit("setSelectedPath", this.path.slice(0, index - length));
    }

    remove() {
        this.$store.commit("deleteConfig", this.path);
        this.navigate(-1);
    }

}
</script>
