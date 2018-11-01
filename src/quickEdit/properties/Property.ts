import Vue, { CreateElement, RenderContext } from "vue";
import { IElementType, ElementTypeClass, IElementTypeSimpleAutocomplete } from '@/data/ElementTypeModel';

import AutocompleteProperty from "./AutocompleteProperty.vue";
import BooleanProperty from "./BooleanProperty.vue";
import ComplexProperty from "./ComplexProperty.vue";
import ItemlistProperty from "./ItemlistProperty.vue";
import ItemProperty from "./ItemProperty.vue";
import NumberProperty from "./NumberProperty.vue";
import StringProperty from "./StringProperty.vue";
import ShopitemlistProperty from "./ShopitemlistProperty.vue";
import StringlistProperty from "./StringlistProperty.vue";

export default Vue.extend({
    functional: true,
    render(h: CreateElement, context: RenderContext) {
        const type = context.props.type as IElementType;
        const name = context.props.name as string;
        const value = context.props.value as any;
        let el;
        const additionalProps: any = {};

        if (type.class === ElementTypeClass.Simple) {
            switch (type.name) {
                case "string":
                    el = StringProperty;
                    break;
                case "boolean":
                    el = BooleanProperty;
                    break;
                case "double":
                    el = NumberProperty;
                    additionalProps.floating = true;
                    break;
                case "integer":
                    el = NumberProperty;
                    additionalProps.floating = false;
                    break;
                case "list_string":
                    el = StringlistProperty;
                    break;
                case "item":
                    el = ItemProperty;
                    break;
            }
        } else if (type.class === ElementTypeClass.Simple_Autocomplete) {
            el = AutocompleteProperty;
            additionalProps.possibilities = (type as IElementTypeSimpleAutocomplete).possibilities;
        } else if (type.class === ElementTypeClass.Complex) {
            switch (type.name) {
                default:
                    el = ComplexProperty;
                    break;
            }
        } else if (type.class === ElementTypeClass.List_Complex) {
            switch (type.name) {
                case "shopitemlist":
                    el = ShopitemlistProperty;
                    break;
                case "list_item":
                    if (Array.isArray(value) && value.some((v) => Array.isArray(v))) {
                        el = ItemlistProperty;
                    } else {
                        el = ItemProperty;
                    }
                    break;
            }
        }

        if (el) {
            return h(el, { props: { name, value, ...additionalProps }, on: context.listeners });
        } else {
            return h("p", `Property ${name} with type ${type.name} is unsupported.`);
        }

    }
} as any);
