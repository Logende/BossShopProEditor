<template>
    <a href="javascript:void()">{{ name }}</a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ComplexProperty extends Vue {

    @Prop({ type: String })
    name!: string;

}
</script>
