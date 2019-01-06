<template>
    <div>
        
        <v-layout row>
            <v-flex xs8 align-self-center class="mr-1"><h3>{{ name }}</h3></v-flex>
            <v-flex xs4 class="ml-1">
                <v-btn outline block color="primary" class="mr-0" @click="addItem">
                    <v-icon>add</v-icon>
                    Add Item
                </v-btn>
            </v-flex>
        </v-layout>

        <div v-for="(item, key) in value" :key="key">
            <v-layout row>
                <v-flex xs8 class="mr-1">
                    <complex-property
                        :name="key"
                        @change-path="changePath(key)"
                    ></complex-property>
                </v-flex>
                <v-flex xs4 class="ml-1">
                    <v-btn @click="removeItem(key)" block outline color="red">
                        <v-icon>delete</v-icon>
                        Delete
                    </v-btn>
                </v-flex>
            </v-layout>
        </div>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { editorData } from '@/data/EditorData';
import { ElementTypeComplexList, IElementTypeComplexList } from '@/data/ElementTypeModel';
import ComplexProperty from "./ComplexProperty.vue";

@Component({
    components: {
        ComplexProperty
    }
})
export default class ComplexListProperty extends Vue {

    @Prop({ type: String })
    name!: string;

    @Prop({ type: Object })
    value!: any;

    @Prop({ type: Object })
    type!: IElementTypeComplexList;

    addItem() {
        let counter = 0;
        let name;
        do {
            name = "NewItem" + (counter || "");
            counter++;
        } while ((this.value || {})[name]);
        this.$emit("input", {
            ...this.value,
            [name]: JSON.parse(JSON.stringify(this.type.defaultElement))
        });
    }

    removeItem(key: string) {
        const copy = JSON.parse(JSON.stringify(this.value));
        delete copy[key];
        this.$emit("input", copy);
    }

    changePath(p: string) {
        this.$emit("change-path", [p]);
    }

}
</script>
