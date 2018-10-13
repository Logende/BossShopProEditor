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
                @change-path="changePath(p.configKey)"
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
import Property from "./properties/Property";

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
        return this.$store.state.selectedPath;
    }

    mounted(): void {
        this.$store.commit("applyConfig", {
            path: "/",
            newValue: {
                ShopName: "TestShop",
                DisplayName: "Shop 156",
                Command: "!#",
            }
        });
        this.$store.commit("setSelectedPath", "/");
    }

    getValue(key: string): any {
        let basePath = this.$store.state.selectedPath;
        if (basePath === "/") { basePath = ""; }
        return _.at(this.$store.state.config, [basePath + key])[0];
    }

    update(path: string, newValue: any): void {
        this.$emit("change-request", { path, newValue });
    }



}
</script>
