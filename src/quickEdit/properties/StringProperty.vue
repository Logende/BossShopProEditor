<template>
    <v-layout>
        <v-flex v-if="formatted" shrink align-self-center>
            <v-tooltip :disabled="!value" top color="black" :open-delay="0">
                <v-icon slot="activator" class="mr-3" style="cursor:pointer;">visibility</v-icon>
                <mc-text :text="value"></mc-text>
            </v-tooltip>
        </v-flex>
        <v-flex grow>
            <v-text-field
                :label="name"
                :value="value"
                @input="$emit('input', $event)"
            ></v-text-field>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import McText from "./McText";

@Component({
    components: {
        McText
    }
})
export default class StringProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: String })
    value!: string;

    @Prop({ type: Boolean, default: false })
    formatted!: boolean;

}
</script>
