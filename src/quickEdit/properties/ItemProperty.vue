<template>
    <div>
        <v-btn block @click="open = true" color="primary">Edit {{ name }}</v-btn>
        <v-dialog v-model="open" max-width="700px">

            <v-card>
                <v-card-title primary-title class="headline">Edit {{ name }}</v-card-title>
                <v-card-text>

                    <v-window v-model="window">

                        <v-window-item :value="0">

                            <v-text-field
                                v-model="text"
                                append-outer-icon="add"
                                label="Item Property To Add"
                                type="text"
                                @click:append-outer="addCustomProperty"
                            ></v-text-field>

                            <v-list class="mb-4" two-line>
                                <v-list-tile v-for="(x, i) in entries" :key="i">

                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ x[1] ? `${x[1]}:${x[0]}` : x[0] }}</v-list-tile-title>
                                    </v-list-tile-content>

                                    <v-list-tile-action>
                                        <div>
                                            <v-btn class="mr-2" icon ripple @click="edit(i)">
                                                <v-icon color="secondary">edit</v-icon>
                                            </v-btn>
                                            <v-btn icon ripple @click="remove(i)">
                                                <v-icon color="secondary">delete</v-icon>
                                            </v-btn>
                                        </div>
                                    </v-list-tile-action>

                                </v-list-tile>
                            </v-list>

                            <v-divider class="mb-3"></v-divider>

                            <h3 class="mb-1">Available Properties</h3>
                            <v-list three-line>
                                <v-list-tile
                                    v-for="(p, i) in availableProperties"
                                    :key="p.name"
                                    @click="addProperty(i)"
                                >
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ p.name }}</v-list-tile-title>
                                        <v-list-tile-sub-title v-html="p.infotext"></v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>

                        </v-window-item>

                        <v-window-item :value="1">
                            <item-property
                                :key="editingIndex"
                                :property="selectedProperty"
                                v-model="tempValue"
                            ></item-property>
                            <v-btn class="ml-0" color="primary" @click="save">Save</v-btn>
                        </v-window-item>

                    </v-window>

                </v-card-text>
            </v-card>

        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { itemProperties } from "@/data/ItemProperties";
import StringlistProperty from "./StringlistProperty.vue";
import ItemPropertyComponent from "./itemproperties/itemProperty";

const regex = /(.*?):(.*)/;

// TODO: Check why v-checkbox isn't working properly

@Component({
    components: {
        "item-property": ItemPropertyComponent
    }
})
export default class ItemProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Array })
    value!: string[];

    window = 0;
    open = false;

    // for adding a custom property
    text = "";

    // for editing properties
    editingIndex = -1;
    tempValue: any = null;

    availableProperties = itemProperties.values;

    get entries() {
        return this.value ?
            this.value.map((s) => {
                const res = regex.exec(s);
                if (res && res.length === 3) {
                    return [res[2], res[1]];
                } else {
                    return [s, ""];
                }
            }) : [];
    }

    get selectedProperty() {
        if (this.editingIndex >= 0) {
            const propertyName = this.entries[this.editingIndex][1];
            if (propertyName) {
                return this.availableProperties.find((x) => x.key === propertyName);
            }
        }
        return undefined;
    }

    addCustomProperty() {
        const newValue = (this.value || []).concat([this.text]);
        this.$emit("input", newValue);
        this.text = "";
    }

    async addProperty(i: number) {
        const p = this.availableProperties[i];
        const defaultValue = p.content.map((e) => e.default).join("#");
        this.$emit("input", (this.value || []).concat([ `${p.key}:${defaultValue}` ]));
        await this.$nextTick();
        if (this.value && this.value.length) {
            this.edit(this.value.length - 1);
        } else {
            this.window = 0;
        }
    }

    edit(index: number) {
        this.editingIndex = index;
        this.tempValue = this.entries[index][0];
        this.window = 1;
    }

    save() {
        const i = this.editingIndex;
        const copy = this.value.slice(0);
        copy[i] = this.entries[i][1] + ":" + this.tempValue;
        this.$emit("input", copy);
        this.window = 0;
        this.editingIndex = -1;
    }

    remove(index: number) {
        const clonedArray = this.value.slice(0);
        clonedArray.splice(index, 1);
        this.$emit("input", clonedArray);
    }

}
</script>
