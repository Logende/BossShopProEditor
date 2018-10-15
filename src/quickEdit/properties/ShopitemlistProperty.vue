<template>
    <v-dialog v-model="open" max-width="700px">

        <v-btn slot="activator" color="primary">Edit ShopItemList</v-btn>

        <v-card>
            <v-card-title primary-title class="headline">ShopItemList</v-card-title>
            <v-card-text>
                <v-layout v-for="row in 4" :key="row" row>
                    <v-layout align-center justify-center>
                        <v-card
                            v-for="x in 9"
                            :key="x"
                            class="ma-2 qe-shopitem"
                            :color="existingItems.includes(((row - 1) * 9 + x).toString()) ? 'primary' : 'secondary'"
                            @click.native="navigate((row - 1) * 9 + x)"
                        >
                            <v-card-text>{{ (row - 1) * 9 + x }}</v-card-text>
                        </v-card>
                    </v-layout>
                </v-layout>
                <div class="mb-4"></div>
            </v-card-text>
        </v-card>

    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { elementTypes } from '@/data/ElementTypes';
import { IElementTypeComplexList } from '@/data/ElementTypeModel';

@Component
export default class ShopitemlistProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Object })
    value!: any;

    open = false;
    silType = elementTypes.get("shopitemlist") as IElementTypeComplexList;

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

    navigate(position: number) {
        this.open = false;
        this.$emit("change-path", [position.toString()]);
    }

}
</script>

<style>
.qe-shopitem {
    width:50px;
    height:50px;
    cursor: pointer;
}
</style>

