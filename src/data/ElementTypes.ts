import "@/data/ElementTypeModel";
import { IElementType, ElementTypeClass, IElementTypeSimple, ElementTypeSimple, ElementTypeSimpleAutocomplete, IElementTypeComplexList, ElementTypeComplex, ElementTypeComplexList, IElementTypeComplex, ElementTypeDependent } from '@/data/ElementTypeModel';

export class ElementTypes {

    private static elementTypes: Map<string, IElementType> = new Map<string, IElementType>()
    public static elementTypeSpecialNames = ["item", "shopitemlist"]; //element types which should get custom QuickEdit support


    private static register(elementType: IElementType){
        ElementTypes.elementTypes.set(elementType.name.toLowerCase(), elementType);
    }
    public static get(name: string): IElementType{
        if(!ElementTypes.elementTypes.has(name.toLowerCase())){
            throw new Error("ElementType with name '" + name + "' not found.");
        }
        return ElementTypes.elementTypes.get(name.toLowerCase())!;
    }


    public static init(){
        //
        //Init simple ElementTypes       
        // 
        ElementTypes.register(new ElementTypeSimple("none"));
        ElementTypes.register(new ElementTypeSimple("string"));
        ElementTypes.register(new ElementTypeSimple("boolean"));
        ElementTypes.register(new ElementTypeSimple("double"));
        ElementTypes.register(new ElementTypeSimple("integer"));
        ElementTypes.register(new ElementTypeSimple("list_string"));
        //TODO: replace example names by actual lists of data names
        ElementTypes.register(new ElementTypeSimpleAutocomplete("material", ["stone", "log"]));
        ElementTypes.register(new ElementTypeSimpleAutocomplete("potioneffect", ["poison", "heal"]));
        ElementTypes.register(new ElementTypeSimpleAutocomplete("enchantment", ["sharpness", "unbreaking"]));
        ElementTypes.register(new ElementTypeSimpleAutocomplete("rewardtype", ["money", "item", "points", "enchantment", "permissions", "commands"]));
        ElementTypes.register(new ElementTypeSimpleAutocomplete("pricetype", ["money", "item", "points"]));

        //
        //Init special ElementTypes
        //
        ElementTypes.register(new ElementTypeComplex("item", [
            {
                configKey: "",
                type: ElementTypes.get("list_string"),
                optional: false
            }
        ]));
        ElementTypes.register(new ElementTypeComplexList("list_item", ElementTypes.get("item") as IElementTypeComplex, 
        ["type:stone", "amount:1"], (config: object, configKey: string) => "todo"));

        
        //
        //Init shop ElementTypes (TODO: Automatically load via config file in the future, to make it possible, to modify those types)
        //
        ElementTypes.register(new ElementTypeDependent("reward", "../RewardType", new Map([
            ["money", "double"],
            ["item", "list_item"],
            ["points", "double"],
            ["enchantment", "string"],
            ["permissions", "list_string"],
            ["commands", "list_string"]
        ])));

        ElementTypes.register(new ElementTypeDependent("price", "../PriceType", new Map([
            ["money", "double"],
            ["item", "list_item"],
            ["points", "double"]
        ])));

        ElementTypes.register(new ElementTypeComplex("shopitem", [
            {
                configKey: "MenuItem",
                type: ElementTypes.get("item"),
                optional: false
            },
            {
                configKey: "RewardType",
                type: ElementTypes.get("rewardtype"),
                optional: false,
            },
            {
                configKey: "Reward",
                type: ElementTypes.get("reward"),
                optional: false
            },
            {
                configKey: "PriceType",
                type: ElementTypes.get("pricetype"),
                optional: false
            },
            {
                configKey: "Price",
                type: ElementTypes.get("price"),
                optional: false
            },
            {
                configKey: "Message",
                type: ElementTypes.get("string"),
                optional: false
            },
            {
                configKey: "InventoryLocation",
                type: ElementTypes.get("integer"),
                optional: false
            },
            {
                configKey: "ExtraPermission",
                type: ElementTypes.get("string"),
                optional: true
            }
        ]));

        ElementTypes.register(new ElementTypeComplexList("shopitemlist", ElementTypes.get("shopitem") as IElementTypeComplex,
        {}, (config: object, configKey: string) => ""));

        ElementTypes.register(new ElementTypeComplex("shop", [
            {
                configKey: "ShopName",
                type: ElementTypes.get("string"),
                optional: false
            },
            {
                configKey: "DisplayName",
                type: ElementTypes.get("string"),
                optional: false
            },
            {
                configKey: "Command",
                type: ElementTypes.get("string"),
                optional: true
            },
            {
                configKey: "signs/text",
                type: ElementTypes.get("string"),
                optional: false
            },
            {
                configKey: "signs/NeedsPermissionToCreateSign",
                type: ElementTypes.get("boolean"),
                optional: false
            },
            {
                configKey: "shop",
                type: ElementTypes.get("shopitemlist"),
                optional: false
            }
        ]))

    }


    



}

ElementTypes.init()