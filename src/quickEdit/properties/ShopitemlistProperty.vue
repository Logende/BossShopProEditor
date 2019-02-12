<template>
    <div>
        <v-btn block @click="open = true" color="primary">Edit ShopItemList</v-btn>
        <v-dialog v-model="open" max-width="700px">
            <v-card>
                <v-card-title primary-title class="headline">ShopItemList</v-card-title>
                <v-card-text>
                    <v-layout v-for="row in 6" :key="row" row>
                        <v-layout align-center justify-center>
                            <v-card
                                v-for="x in 9"
                                :key="x"
                                class="ma-2 qe-shopitem"
                                :color="!!items[(row - 1) * 9 + x] ? 'primary' : 'secondary'"
                                @click.native="navigate((row - 1) * 9 + x)"
                            >
                                <v-card-text style="text-align:center;">
                                    {{ !!items[(row - 1) * 9 + x] ? (row - 1) * 9 + x : "+" }}
                                </v-card-text>
                            </v-card>
                        </v-layout>
                    </v-layout>
                    <div class="mb-4"></div>
                </v-card-text>
            </v-card>

        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { elementTypes } from '@/data/ElementTypes';
import { IElementTypeComplexList } from '@/data/ElementTypeModel';
import _ from "lodash";

@Component
export default class ShopitemlistProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Object })
    value!: any;

    open = false;
    silType = elementTypes.get("shopitemlist") as IElementTypeComplexList;

    get items() {

        const items = Array(36);

        if (this.value) {
            const unorderedItems: string[] = [];
            _.forIn(this.value, (v, k) => {
                if (typeof(v.InventoryLocation) !== "undefined") {
                    items[v.InventoryLocation] = k;
                } else {
                    unorderedItems.push(k);
                }
            });
            unorderedItems.forEach((k) => {
                const firstFreeSlot = _.findIndex(items, (x) => !!x);
                items[firstFreeSlot] = k;
            });
        }

        return items;

    }

    navigate(position: number) {
        this.open = false;
        if (!this.items[position]) {
            // empty slot - create a new item
            // TODO: This might result in duplicate keys
            // if there is already an item with key "position"
            const defaultElement = JSON.parse(JSON.stringify(this.silType.defaultElement));
            _.set(defaultElement, "InventoryLocation", position);
            this.$emit("input", {
                ...this.value,
                [position.toString()]: defaultElement
            });
            this.$emit("change-path", [position.toString()]);
        } else {
            this.$emit("change-path", [this.items[position]]);
        }
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

