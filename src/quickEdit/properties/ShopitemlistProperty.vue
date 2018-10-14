<template>
    <div>
        <p>{{ name }}</p>
        <ul>
            <li v-for="(v, k) in value" :key="k">
                {{k}} - {{v}}
                <v-btn @click="$emit('change-path', [k])">Go</v-btn>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ShopitemlistProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Object })
    value!: any;

}
</script>

