<template>
    <div>
        <h1>QuickEdit Section</h1>

        <sui-form>
            <sui-form-field
                v-for="p in editableProperties"
                :key="p.configKey"
            >
                <qe-property            
                    :type="p.type"
                    :name="p.configKey"
                ></qe-property>
            </sui-form-field>
        </sui-form>

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
        return (this.bt.class === ElementTypeClass.Complex) ?
            (this.bt as IElementTypeComplex).properties :
            [];
    }

}
</script>
