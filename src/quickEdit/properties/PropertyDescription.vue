<template>
    <v-tooltip top right :open-delay="0">
        <v-icon slot="activator" class="ml-3" style="cursor:pointer;">help_outline</v-icon>
        {{ description }}
    </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class PropertyDescription extends Vue {

    @Prop({ type: String })
    description!: string;

}
</script>
