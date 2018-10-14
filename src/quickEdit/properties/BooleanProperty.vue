<template>
    <v-checkbox :label="name" :value="value" @input="$emit('input', $event)"></v-checkbox>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BooleanProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Boolean })
    value!: boolean;

}
</script>
