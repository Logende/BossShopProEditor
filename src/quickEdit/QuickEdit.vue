<template>
    <div>
        <h1 class="mb-3">QuickEdit Section</h1>

        <v-form>
            <qe-property
                v-for="p in editableProperties"
                :key="p.configKey"
                :type="p.type"
                :name="p.configKey"
            ></qe-property>
        </v-form>

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

    bt = elementTypes.get("shopitem");

    get editableProperties() {
        return (this.bt.class === ElementTypeClass.Complex) ?
            (this.bt as IElementTypeComplex).properties :
            [];
    }

}
</script>
