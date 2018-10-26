import BooleanProperty from "../BooleanProperty.vue";
import NumberProperty from "../NumberProperty.vue";
import StringProperty from "../StringProperty.vue";

export default {
    "Type": StringProperty,
    "Amount": NumberProperty,
    "Durability": NumberProperty,
    "Name": StringProperty,
    "Lore": StringProperty,
    "Enchantment": StringProperty,
    "Color": StringProperty,
    "Potion": StringProperty,
    "Potioneffect": StringProperty,
    "Playerhead": StringProperty,
    "Custom Skull": StringProperty,
    "Mob Spawner": StringProperty,
    "Monster Egg": StringProperty,
    "Hide Flags": StringProperty,
    "Unbreakable": BooleanProperty,
    "Book": StringProperty,
    "Book Page": StringProperty
} as Record<string, any>;
