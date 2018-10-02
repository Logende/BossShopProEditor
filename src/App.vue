<template>
    <sui-container fluid style="height: 100%;">

        <sui-menu inverted attached>
            <sui-menu-item class="header">BossShopPro Editor</sui-menu-item>
        </sui-menu>

        <sui-grid divided style="height: calc(100% - 40px);">
            <sui-grid-row>
                <sui-grid-column style="flex-grow:1;">
                    LEFT
                </sui-grid-column>
                <sui-grid-column style="flex-grow:1;">
                    <quick-edit></quick-edit>
                </sui-grid-column>
            </sui-grid-row>
        </sui-grid>

    </sui-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QuickEdit from "./quickEdit/QuickEdit.vue";

@Component({
    components: {
        "quick-edit": QuickEdit
    }
})
export default class App extends Vue {

}
</script>
