<template>
    <v-dialog v-model="open" max-width="700px">

        <v-btn slot="activator" color="primary">{{ name }}</v-btn>

        <v-card>
            <v-card-title primary-title class="headline">Edit item {{ name }}</v-card-title>
            <v-card-text>
                test123
            </v-card-text>
        </v-card>

    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import itemProperties from "../itemProperties";

// TODO: Maybe download available items from here?
// https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Material.html

@Component
export default class ItemProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Boolean })
    value!: boolean;

    availableProperties = itemProperties;

}
</script>
