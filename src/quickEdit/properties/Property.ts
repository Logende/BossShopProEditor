import Vue, { CreateElement, RenderContext } from "vue";
import { IElementType, ElementTypeClass } from '@/data/ElementTypeModel';
import BooleanProperty from "./BooleanProperty.vue";
import ComplexProperty from "./ComplexProperty.vue";
import StringProperty from "./StringProperty.vue";
import ShopitemlistProperty from "./ShopitemlistProperty.vue";

export default Vue.extend({
    functional: true,
    render(h: CreateElement, context: RenderContext) {
        const type = context.props.type as IElementType;
        const name = context.props.name as string;
        const value = context.props.value as any;
        let el;

        if (type.class === ElementTypeClass.Simple) {
            switch (type.name) {
                case "string":
                    el = StringProperty;
                    break;
                case "boolean":
                    el = BooleanProperty;
                    break;
            }
        } else if (type.class === ElementTypeClass.Complex) {
            el = ComplexProperty;
        } else if (type.class === ElementTypeClass.List_Complex) {
            switch (type.name) {
                case "shopitemlist":
                    el = ShopitemlistProperty;
                    break;
            }
        }

        if (el) {
            return h(el, { props: { name, value }, on: context.listeners });
        } else {
            return h("p", `Property ${name} with type ${type.name} is unsupported.`);
        }

    }
} as any);
