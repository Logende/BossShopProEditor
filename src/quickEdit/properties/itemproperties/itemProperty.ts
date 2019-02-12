import { CreateElement } from 'vue';
import { Vue, Component, Prop } from "vue-property-decorator";

import { IItemProperty } from '@/data/ItemPropertyModel';
import { elementTypes } from "@/data/ElementTypes";
import StringProperty from "../StringProperty.vue";
import Property from "../Property";

@Component
export default class ItemProperty extends Vue {

    @Prop()
    property?: IItemProperty;

    @Prop({ type: String })
    value!: string;

    get splitValue() {
        if (!this.property) { return []; }
        const splitValue = (this.value as string || "").split("#");
        for (let i = 0; i < this.property.content.length; i++) {
            splitValue[i] = splitValue[i] || "";
        }
        return splitValue;
    }

    updateListener(index: number, newValue: any) {
        const copy = this.splitValue.slice();
        copy[index] = "" + newValue;
        this.$emit("input", copy.join("#"));
    }

    render(h: CreateElement) {

        // check whether this a supported property
        if (this.property) {

            // get fields
            const p = this.property as IItemProperty;

            const children = p.content.map((c, i) => {
                try {
                    const type = c.type;
                    if (!type) { throw new Error(); }
                    return h(Property, {
                        props: {
                            type,
                            name: c.displayname,
                            value: this.splitValue[i],
                            noCard: true
                        },
                        on: {
                            input: (e: any) => this.updateListener(i, e)
                        }
                    });
                } catch {
                    return h(StringProperty, {
                        props: {
                            name: c.displayname,
                            value: this.splitValue[i]
                        },
                        on: {
                            input: (e: any) => this.updateListener(i, e)
                        }
                    });
                }
            });

            children.push(
                h("h3", { class: "mt-3" }, "Definition"),
                h("p", p.definition),
                h("h3", "Description"),
                h("p", p.infotext)
            );

            return h("div", children);

        } else {
            return h(StringProperty, {
                props: {
                    name: "Edit value",
                    value: this.$props.value
                },
                on: this.$listeners
            });
        }

    }

}
