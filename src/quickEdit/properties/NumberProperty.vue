<template>
    <v-text-field
        type="number"
        :label="name"
        :value="value"
        @input="input"
    ></v-text-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NumberProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop()
    value!: any;

    @Prop({ type: Boolean })
    floating!: boolean;

    get sanitizedValue() {
        switch (typeof(this.value)) {
            case "string":
                return this.floating ?
                    Number.parseFloat(this.value) :
                    Number.parseInt(this.value, 10);
            case "number":
                return this.value;
            default:
                return 0;
        }
    }

    input(newValue: string) {
        if (this.floating) {
            this.$emit("input", parseFloat(newValue));
        } else {
            this.$emit("input", parseInt(newValue, 10));
        }
    }

}
</script>

