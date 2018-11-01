import BooleanProperty from "../BooleanProperty.vue";
import NumberProperty from "../NumberProperty.vue";
import StringProperty from "../StringProperty.vue";

const intConversion = (s: string) => Number.parseInt(s, 10);

export default {
    type: StringProperty,
    amount: { component: NumberProperty, conversion: intConversion },
    durability: { component: NumberProperty, conversion: intConversion },
    name: StringProperty,
    lore: StringProperty,
    enchantment: StringProperty,
    color: StringProperty,
    potion: StringProperty,
    potioneffect: StringProperty,
    playerhead: StringProperty,
    customskull: StringProperty,
    mobspawner: StringProperty,
    monsteregg: StringProperty,
    hideflags: StringProperty,
    unbreakable: BooleanProperty,
    book: StringProperty,
    bookpage: StringProperty
} as Record<string, any>;
