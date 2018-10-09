import Vue, { CreateElement, RenderContext } from "vue";
import BooleanProperty from "./BooleanProperty.vue";
import ComplexProperty from "./ComplexProperty.vue";
import StringProperty from "./StringProperty.vue";
import { IElementType, ElementTypeClass } from '@/data/ElementTypeModel';

export default Vue.extend({
    functional: true,
    render(h: CreateElement, context: RenderContext) {
        const type = context.props.type as IElementType;
        const name = context.props.name as string;
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
        }

        if (el) {
            return h(el, { props: { name } });
        } else {
            return h("p", `Property ${name} with type ${type.name} is unsupported.`);
        }

    }
} as any);
