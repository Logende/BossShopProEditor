<template>
    <v-app>

        <v-toolbar dark>
            <v-toolbar-title>BossShopPro Editor</v-toolbar-title>
        </v-toolbar>

        <!-- style="height: calc(100% - 40px);" -->
        <v-container fluid>
            <v-layout row>
                <v-flex xs6>
                    <config-edit
                        @selected-path-changed="selectedPathChanged"
                        @change-request="changeRequest"
                    ></config-edit>
                </v-flex>
                <v-flex xs6>
                    <quick-edit
                        @selected-path-changed="selectedPathChanged"
                        @change-request="changeRequest"
                    ></quick-edit>
                </v-flex>
            </v-layout>
        </v-container>

    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QuickEdit from "./quickEdit/QuickEdit.vue";
import ConfigEdit from "./configEdit/ConfigEdit.vue";

@Component({
    components: {
        "quick-edit": QuickEdit,
        "config-edit": ConfigEdit
    }
})
export default class App extends Vue {

    selectedPathChanged(newPath: string) {
        this.$store.
    }

}
</script>
