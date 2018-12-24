<template>
    <div>
        <v-layout row>
            <v-flex xs8 align-self-center><h3>{{ name }}</h3></v-flex>
            <v-flex xs4><v-btn outline small color="primary" class="mr-0" style="float:right;" @click="addItem">Add Item</v-btn></v-flex>
        </v-layout>

        <!-- single item -->
        <v-layout row v-if="isSingleItem">
            <v-flex xs12>
                <item-property
                    name="Item #1"
                    :value="singleItem"
                    @input="$emit('input', $event)"
                ></item-property>
            </v-flex>
        </v-layout>

        <!-- multiple items -->
        <div
            v-else
            v-for="(item, index) in value"
            :key="index"
        >
            <v-layout row>
                <v-flex xs8 class="mr-1">
                    <item-property
                        :name="'Item #' + (index + 1)"
                        :value="item"
                        @input="handleItemInput(index, $event)"
                    ></item-property>
                </v-flex>
                <v-flex xs4 class="ml-1">
                    <v-btn @click="removeItem(index)" block color="red">
                        <v-icon>delete</v-icon>
                        Delete
                    </v-btn>
                </v-flex>
            </v-layout>
        </div>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { elementTypes } from "@/data/ElementTypes";
import { ElementTypeComplexList } from '@/data/ElementTypeModel';
import ItemProperty from "./ItemProperty.vue";

@Component({
    components: {
        ItemProperty
    }
})
export default class ItemlistProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Array })
    value!: any[];

    get isSingleItem() {
        return this.value && (this.value.some((e) => typeof(e) === "string") || this.value.length === 1);
    }

    get singleItem() {
        return Array.isArray(this.value[0]) ? this.value[0] : this.value;
    }

    private listItemType = elementTypes.get("list_item") as ElementTypeComplexList;

    addItem() {
        const clone = JSON.parse(JSON.stringify(this.listItemType.defaultElement));
        let newValue = this.value;
        if (this.isSingleItem && newValue && !Array.isArray(newValue[0])) {
            newValue = [newValue];
        } else if (!newValue) {
            newValue = [];
        }
        newValue.push(clone);
        this.$emit("input", newValue);
    }

    removeItem(index: number) {
        const copy = this.value.slice();
        copy.splice(index, 1);
        this.$emit("input", copy);
    }

    handleItemInput(index: number, item: any) {
        const copy = this.value.slice();
        copy[index] = item;
        this.$emit("input", copy);
    }

}
</script>
