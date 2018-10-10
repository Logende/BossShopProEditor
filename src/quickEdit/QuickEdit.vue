<template>
    <div>
        <h1 class="mb-3">QuickEdit Section</h1>

        <v-form v-if="editableProperties.length > 0">
            <h3 class="mb-2">{{ bt.name }}</h3>
            <qe-property
                v-for="p in editableProperties"
                :key="p.configKey"
                :type="p.type"
                :name="p.configKey"
            ></qe-property>
        </v-form>

        <v-alert :value="true" type="info" v-else>This property is not supported.</v-alert>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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

}
</script>
