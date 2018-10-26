import Vue, { CreateElement, RenderContext } from "vue";
import mapping from "./mapping";

export default Vue.extend({
    functional: true,
    render(h: CreateElement, context: RenderContext) {
        const property = context.props.property as string;
        let el;
        if (typeof(mapping[property]) !== "undefined") {
            h(el = mapping[property], { props: context.props });
        } else {
            h("p", "Unknown property");
        }
    }
} as any);
