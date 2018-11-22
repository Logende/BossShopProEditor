import Vue, { CreateElement } from "vue";
import mapping from "./mapping";
import properties from "../../itemProperties";
import StringProperty from "../StringProperty.vue";
import _ from "lodash";

export default Vue.extend({
    props: [ "property", "value" ],
    render(h: CreateElement) {
        const property = this.property as string;
        const m = mapping[property];
        if (typeof(m) !== "undefined") {
            let value = this.$props.value;
            let component = m;
            if (m.conversion) {
                value = m.conversion(value);
                component = m.component;
            }
            const elements = [];
            elements.push(h(component, {
                props: {
                    name: property,
                    value
                },
                on: this.$listeners
            }));

            const p = properties.find((x) => x.key === property);
            if (p) {
                // render some information text
                elements.push(
                    h("h3", "Definition"),
                    h("p", p.definition),
                    h("h3", "Description"),
                    h("p", p.infotext)
                );
            }

            return h("div", elements);
        } else {
            return h(StringProperty, {
                props: {
                    name: property,
                    value: this.$props.value
                },
                on: this.$listeners
            });
        }
    }
});
