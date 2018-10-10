<template>
    <div>
        <label>{{ name }}</label>
        <input type="text" :placeholder="name"></input>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StringProperty extends Vue {

    @Prop({ type: String })
    name!: string;

}
</script>
