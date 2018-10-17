<template>
    <v-autocomplete
        :label="name"
        :value="value"
        :items="possibilities"
        @input="$emit('input', $event)"
    ></v-autocomplete>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StringProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: String })
    value!: string;

    @Prop({ type: Array })
    possibilities!: string[];

}
</script>
