<template>
    <div>
        <h3>{{ name }}</h3>
        <v-btn outline color="primary" :disabled="!canAdd">Add Item</v-btn>



    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ItemlistProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Array })
    value!: any;

}
</script>
