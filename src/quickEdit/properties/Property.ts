import Vue, { CreateElement, RenderContext } from "vue";
import { IElementType, ElementTypeClass, IElementTypeSimpleAutocomplete } from '@/data/ElementTypeModel';

import PropertyDescription from "./PropertyDescription.vue";

import AutocompleteProperty from "./AutocompleteProperty.vue";
import BooleanProperty from "./BooleanProperty.vue";
import ComplexListProperty from "./ComplexListProperty.vue";
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
        const noCard = context.props.noCard as boolean;
        let el;
        const additionalProps: any = {};

        if (type.class === ElementTypeClass.Simple) {
            switch (type.name) {
                case "string":
                    el = StringProperty;
                    break;
                case "string_formatted":
                    el = StringProperty;
                    additionalProps.formatted = true;
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
                    el = ItemlistProperty;
                    break;
                default:
                    el = ComplexListProperty;
                    additionalProps.type = type;
                    break;
            }
        }

        let content;
        if (el) {
            content = h(el, { props: { name, value, ...additionalProps }, on: context.listeners });
            if (type.description) {
                content = h("v-layout", [
                    h("v-flex", { attrs: { grow: true } }, [content]),
                    h("v-flex", { attrs: { "shrink": true, "align-self-center": true } }, [
                        h(PropertyDescription, { props: { description: type.description } })
                    ])
                ]);
            }
        } else if (type.name !== "none") {
            content = h("p", `Property ${name} with type ${type.name} is unsupported.`);
        }

        if (content) {
            return noCard ? content : h("v-card", { class: "mb-3" }, [ h("v-card-text", [ content ]) ]);
        }

    }
} as any);
