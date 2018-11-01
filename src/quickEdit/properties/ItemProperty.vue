<template>
    <v-dialog v-model="open" max-width="700px">

        <v-btn slot="activator" color="primary" class="ml-0 mb-4">Edit {{ name }}</v-btn>

        <v-card>
            <v-card-title primary-title class="headline">Edit {{ name }}</v-card-title>
            <v-card-text>

                <v-window v-model="window">

                    <v-window-item :value="0">
                        <v-btn outline class="ml-0 mb-4" @click="window = 1">Add Item Property</v-btn>

                        <v-text-field
                            v-model="text"
                            append-outer-icon="add"
                            label="Add Property"
                            type="text"
                            @click:append-outer="addCustomProperty"
                        ></v-text-field>

                        <v-list class="mb-4" two-line>
                            <v-list-tile v-for="(x, i) in entries" :key="i">

                                <v-list-tile-content>
                                    <v-list-tile-title>{{ x[0] }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ x[1] }}</v-list-tile-sub-title>
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
                    </v-window-item>

                    <v-window-item :value="1">

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

                        <v-btn @click="window = 0">Back</v-btn>
                    </v-window-item>

                    <v-window-item :value="2">
                        <item-property
                            :key="editingIndex"
                            :property="selectedProperty[1]"
                            v-model="tempValue"
                        ></item-property>
                        <v-btn class="ml-0" color="primary" @click="save">Save</v-btn>
                    </v-window-item>

                </v-window>

            </v-card-text>
        </v-card>

    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import itemProperties from "../itemProperties";
import StringlistProperty from "./StringlistProperty.vue";
import ItemPropertyComponent from "./itemproperties/itemProperty";

// TODO: Maybe download available items from here?
// https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Material.html

const regex = /(.*?):(.*)/;

// TODO: Check why v-checkbox isn't working properly

@Component({
    components: {
        "string-list": StringlistProperty,
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

    availableProperties = itemProperties;

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
        return this.editingIndex >= 0 ? this.entries[this.editingIndex] : ["", ""];
    }

    addCustomProperty() {
        const newValue = (this.value || []).concat([this.text]);
        this.$emit("input", newValue);
        this.text = "";
    }

    addProperty(i: number) {
        this.$emit("input", this.value.concat([ this.availableProperties[i].config ]));
        this.window = 0;
    }

    edit(index: number) {
        this.editingIndex = index;
        this.tempValue = this.entries[index][0];
        this.window = 2;
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
