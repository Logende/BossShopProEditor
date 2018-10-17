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

    @Prop({ type: Number })
    value!: number;

    @Prop({ type: Boolean })
    floating!: boolean;

    input(newValue: number) {
        if (this.floating) {
            this.$emit("input", newValue);
        } else {
            this.$emit("input", Math.trunc(newValue));
        }
    }

}
</script>

