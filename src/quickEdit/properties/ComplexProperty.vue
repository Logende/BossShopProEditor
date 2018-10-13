<template>
    <p><v-btn @click="$emit('changePath')" flat color="primary">{{ name }}</v-btn></p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ComplexProperty extends Vue {

    @Prop({ type: String })
    name!: string;

}
</script>
