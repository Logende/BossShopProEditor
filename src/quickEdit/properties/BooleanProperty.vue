<template>
    <v-checkbox :label="name"></v-checkbox>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BooleanProperty extends Vue {

    @Prop({ type: String })
    name!: string;

}
</script>
