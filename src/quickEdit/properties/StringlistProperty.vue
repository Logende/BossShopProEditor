<template>
    <div>

        <h3>{{ name }}</h3>

        <v-text-field
            v-model="text"
            append-outer-icon="add"
            label="Add Property"
            type="text"
            @click:append-outer="add"
        ></v-text-field>

        <v-list two-line>
            <v-list-tile
                v-for="(x, i) in entries"
                :key="i"
            >

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

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

const regex = /(.*?):(.*)/;

@Component
export default class StringlistProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Array })
    value!: string[];

    text = "";

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

    add() {
        const newValue = (this.value || []).concat([this.text]);
        this.$emit("input", newValue);
        this.text = "";
    }

    edit(index: number) {
        this.text = this.value[index];
        this.remove(index);
    }

    remove(index: number) {
        const clonedArray = this.value.slice(0);
        clonedArray.splice(index, 1);
        this.$emit("input", clonedArray);
    }

}
</script>
