<template>
    <v-text-field :label="name" :value="value" @input="$emit('input', $event)"></v-text-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StringProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: String })
    value!: string;

}
</script>
