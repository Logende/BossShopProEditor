<template>
    <v-dialog v-model="open" max-width="700px">

        <v-btn slot="activator" color="primary">Edit ShopItemList</v-btn>

        <v-card>
            <v-card-title primary-title class="headline">ShopItemList</v-card-title>
            <v-card-text>
                <v-layout v-for="row in 4" :key="row" row>
                    <v-layout align-center justify-center>
                        <v-card v-for="x in 9" :key="x" class="ma-2 qe-shopitem"
                                :color="existingItems.includes(((row - 1) * 9 + x).toString()) ? 'primary' : 'secondary'">
                            <v-card-text>{{ (row - 1) * 9 + x }}</v-card-text>
                        </v-card>
                    </v-layout>
                </v-layout>
            </v-card-text>
        </v-card>

    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ShopitemlistProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Object })
    value!: any;

    open = false;

    get existingItems() {
        return this.value ?
            Object.keys(this.value) :
            [];
    }

    getColor(position: number) {
        if (!this.value || this.value[position.toString()] === "undefined") {
            return "secondary";
        } else {
            return "primary";
        }
    }

}
</script>

<style>
.qe-shopitem {
    width:50px;
    height:50px
}
</style>

