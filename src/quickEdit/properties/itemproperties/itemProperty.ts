import Vue, { CreateElement } from "vue";
import mapping from "./mapping";
import _ from "lodash";

export default Vue.extend({
    props: {
        property: {
            type: String,
            required: true
        }
    },
    render(h: CreateElement) {
        const property = this.property as string;
        const m = mapping[property];
        if (typeof(m) !== "undefined") {
            let value = this.$attrs.value;
            let component = m;
            if (m.conversion) {
                value = m.conversion(value);
                component = m.component;
            }
            return h(component, {
                props: {
                    name: property,
                    value
                },
                on: this.$listeners
            });
        } else {
            return h("p", "Unknown property");
        }
    }
});
