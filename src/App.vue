<template>
    <v-app dark>

        <v-toolbar>
            <v-toolbar-title>BossShopPro Editor</v-toolbar-title>
        </v-toolbar>

        <!-- style="height: calc(100% - 40px);" -->
        <v-container fluid>
            <v-layout row>
                <v-flex xs6>
                    <config-edit></config-edit>
                </v-flex>
                <v-flex xs1>
                    <v-divider vertical style="margin-left:50%;margin-right:50%;"></v-divider>
                </v-flex>
                <v-flex xs5>
                    <quick-edit></quick-edit>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- Error handling -->
        <v-snackbar>I am an error</v-snackbar>

    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QuickEdit from "./quickEdit/QuickEdit.vue";
import ConfigEdit from "./configEdit/ConfigEdit.vue";
import { IElementType } from '@/data/ElementTypeModel';

@Component({
    components: {
        "quick-edit": QuickEdit,
        "config-edit": ConfigEdit
    }
})
export default class App extends Vue {

}
</script>
