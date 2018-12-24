<template>
    <v-checkbox :label="name" :input-value="boolValue" @change="$emit('input', !!$event)"></v-checkbox>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BooleanProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: [String, Boolean] })
    value!: string|boolean;

    get boolValue() {
        return typeof(this.value) === "boolean" ? this.value : this.value === "true";
    }

}
</script>
