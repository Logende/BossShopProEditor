// tslint:disable:object-literal-key-quotes

export default [
    {
        "name": "Type",
        "key": "type",
        "default": "STONE",
        "definition": "type:<type>",
        "infotext": "This defines the material of the item. You can for example use 'type:1' or 'type:stone' in order to make your item stone."
    },
    {
        "name": "Amount",
        "key": "amount",
        "default": "1",
        "definition": "amount:<number>",
        "infotext": "The amount of items to receive"
    },
    {
        "name": "Durability",
        "key": "durability",
        "default": "100",
        "definition": "durability:<number>",
        "infotext": "Durability does different things. For example it defines the damage of Armor/Weapons/Tools and it defines the color of wool."
    },
    {
        "name": "Name",
        "key": "name",
        "default": "MyItemName",
        "definition": "name:<name>",
        "infotext": "The displayed name of the item."
    },
    {
        "name": "Lore",
        "key": "lore",
        "default": "line1#line2#line3",
        "definition": "lore:<line1#line2#line3>",
        "infotext": "This is the lore of the item. You can use color codes like &4 (=DARK_RED) or &l (= BOLD). You can 'switch' to the next line using '#'."
    },
    {
        "name": "Enchantment",
        "key": "enchantment",
        "default": "16#5",
        "definition": "enchantment:<enchantment name>#<level>",
        "infotext": "Use this attribute to enchant your item. Example: 'enchantment:damage_all#5' or 'enchantment:16#5' <- This would add Sharpness V to your item."
    },
    {
        "name": "Color",
        "key": "color",
        "default": "64#128#255",
        "definition": "color:<red number>#<green number>#<blue number>",
        "infotext": "Use this attribute to dye your item (works with leather armor)."
    },
    {
        "name": "Potion",
        "key": "potion",
        "default": "MUNDANE#true#false",
        "definition": "potion:<potion name>#<extended? true/false>#<upgraded? <true/false>",
        "infotext": "This allows you to add vanilla potion effects to items. Can only be used on items which support potioneffects!"
    },
    {
        "name": "Potioneffect",
        "key": "potioneffect",
        "default": "STRENGTH#1#600",
        "definition": "potioneffect:<potion name>#<level>#<time in seconds>",
        "infotext": "This allows you to add custom potion effects to items. Can only be used on items which support potioneffects!"
    },
    {
        "name": "Playerhead",
        "key": "playerhead",
        "default": "Herobrine",
        "definition": "playerhead:<name>",
        "infotext": "This allows you to set the name of skulls. IMPORTANT: You can only use this attribute on skulls ('type:SKULL_ITEM') AND the durability has to be 3 ('durability:3')."
    },
    {
        "name": "Custom Skull",
        "key": "customskull",
        "default": "URL",
        "definition": "customskull:<texture/mojang skin url>",
        "infotext": "This allows you to give skulls custom and fix textures which do not change when a player changes his skin."
    },
    {
        "name": "Mob Spawner",
        "key": "mobspawner",
        "default": "BLAZE",
        "definition": "mobspawner:<mob name>",
        "infotext": "Allows you to make your item a working mobpawner with a pre-set mobtype. Requires the plugin SilkSpawners or EpicSpawners. If you use EpicSpawners use the spawner identifier (defined in your EpicSpawners/spawners.yml file) instead of the Spigot mob name."
    },
    {
        "name": "Monster Egg",
        "key": "monsteregg",
        "default": "BLAZE",
        "definition": "monsteregg:<mob name>",
        "infotext": "Allows making items a working monsteregg with a pre-set mobtype. Requires the plugin SilkSpawners."
    },
    {
        "name": "Hide Flags",
        "key": "hideflags",
        "default": "HIDE_ATTRIBUTES#HIDE_ENCHANTS",
        "definition": "hideflags:<flag1#flag2#flag3>",
        "infotext": "Fast way to hide flags."
    },
    {
        "name": "Unbreakable",
        "key": "unbreakable",
        "default": "true",
        "definition": "unbreakable:true",
        "infotext": "Makes the item completely unbreakable. Useful for adventure maps for example. This feature only works on Spigot servers though."
    },
    {
        "name": "Book",
        "key": "book",
        "default": "My awesome Book#Unknown player",
        "definition": "book:<title>#<author>",
        "infotext": "Adds title and author name to a written book. Supports color codes and symbols."
    },
    {
        "name": "Book Page",
        "key": "bookpage",
        "default": "1#This is some text",
        "definition": "bookpage:<page>#<text>",
        "infotext": "Adds text to the given book page. Can be used multiple times per page in order to force a new line."
    }
];
