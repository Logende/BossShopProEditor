<template>
    <v-dialog v-model="open" max-width="700px">

        <v-btn slot="activator" color="primary" class="ml-0 mb-4">Edit {{ name }}</v-btn>

        <v-card>
            <v-card-title primary-title class="headline">Edit {{ name }}</v-card-title>
            <v-card-text>

                <v-window v-model="window">

                    <v-window-item :value="0">
                        <v-btn outline class="ml-0 mb-4" @click="window = 1">Add Item Property</v-btn>
                
                        <!-- list of properties -->
                        <string-list
                            name="Item Properties"
                            :value="value"
                            @input="$emit('input', $event)"
                        ></string-list>
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

                </v-window>

            </v-card-text>
        </v-card>

    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import itemProperties from "../itemProperties";
import StringlistProperty from "./StringlistProperty.vue";

// TODO: Maybe download available items from here?
// https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Material.html

@Component({
    components: {
        "string-list": StringlistProperty
    }
})
export default class ItemProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Array })
    value!: string[];

    window = 0;
    open = false;

    availableProperties = itemProperties;

    addProperty(i: number) {
        this.$emit("input", this.value.concat([ this.availableProperties[i].config ]));
        this.window = 0;
    }

}
</script>
