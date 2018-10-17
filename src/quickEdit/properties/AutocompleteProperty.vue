<template>
    <v-combobox
        :label="name"
        :value="value"
        :items="possibilities"
        @change="$emit('input', $event)"
    ></v-combobox>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class AutocompleteProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: String })
    value!: string;

    @Prop({ type: Array })
    possibilities!: string[];

}
</script>
