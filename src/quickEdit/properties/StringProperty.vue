<template>
    <v-text-field :label="name" v-model="value"></v-text-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StringProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    value = "";

}
</script>
