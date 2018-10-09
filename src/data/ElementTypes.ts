import "@/data/ElementTypeModel";
import { IElementType, ElementTypeClass, IElementTypeSimple, ElementTypeSimple, ElementTypeSimpleAutocomplete, IElementTypeComplexList, ElementTypeComplex, ElementTypeComplexList, IElementTypeComplex, ElementTypeDependent } from '@/data/ElementTypeModel';

class ElementTypes {

    private static _instance: ElementTypes = new ElementTypes();

    public static getInstance(): ElementTypes{
        return ElementTypes._instance;
    }



    private elementTypes: Map<string, IElementType> = new Map<string, IElementType>()
    public elementTypeSpecialNames = ["item", "shopitemlist"]; //element types which should get custom QuickEdit support


    private register(elementType: IElementType){
        this.elementTypes.set(elementType.name.toLowerCase(), elementType);
    }
    public get(name: string): IElementType{
        if(!this.elementTypes.has(name.toLowerCase())){
            throw new Error("ElementType with name '" + name + "' not found.");
        }
        return this.elementTypes.get(name.toLowerCase())!;
    }


    constructor(){
        if(ElementTypes._instance){
            throw new Error("Error: Instantiation failed: Use ElementTypes.getInstance() instead of new.");
        }
        //
        //Init simple ElementTypes       
        // 
        this.register(new ElementTypeSimple("none"));
        this.register(new ElementTypeSimple("string"));
        this.register(new ElementTypeSimple("boolean"));
        this.register(new ElementTypeSimple("double"));
        this.register(new ElementTypeSimple("integer"));
        this.register(new ElementTypeSimple("list_string"));
        //TODO: replace example names by actual lists of data names
        this.register(new ElementTypeSimpleAutocomplete("material", ["stone", "log"]));
        this.register(new ElementTypeSimpleAutocomplete("potioneffect", ["poison", "heal"]));
        this.register(new ElementTypeSimpleAutocomplete("enchantment", ["sharpness", "unbreaking"]));
        this.register(new ElementTypeSimpleAutocomplete("rewardtype", ["money", "item", "points", "enchantment", "permissions", "commands"]));
        this.register(new ElementTypeSimpleAutocomplete("pricetype", ["money", "item", "points"]));

        //
        //Init special ElementTypes
        //
        this.register(new ElementTypeComplex("item", [
            {
                configKey: "",
                type: this.get("list_string"),
                optional: false
            }
        ]));
        this.register(new ElementTypeComplexList("list_item", this.get("item") as IElementTypeComplex, 
        ["type:stone", "amount:1"], (config: object, configKey: string) => "todo"));

        
        //
        //Init shop ElementTypes (TODO: Automatically load via config file in the future, to make it possible, to modify those types)
        //
        this.register(new ElementTypeDependent("reward", "../RewardType", new Map([
            ["money", "double"],
            ["item", "list_item"],
            ["points", "double"],
            ["enchantment", "string"],
            ["permissions", "list_string"],
            ["commands", "list_string"]
        ])));

        this.register(new ElementTypeDependent("price", "../PriceType", new Map([
            ["money", "double"],
            ["item", "list_item"],
            ["points", "double"]
        ])));

        this.register(new ElementTypeComplex("shopitem", [
            {
                configKey: "MenuItem",
                type: this.get("item"),
                optional: false
            },
            {
                configKey: "RewardType",
                type: this.get("rewardtype"),
                optional: false,
            },
            {
                configKey: "Reward",
                type: this.get("reward"),
                optional: false
            },
            {
                configKey: "PriceType",
                type: this.get("pricetype"),
                optional: false
            },
            {
                configKey: "Price",
                type: this.get("price"),
                optional: false
            },
            {
                configKey: "Message",
                type: this.get("string"),
                optional: false
            },
            {
                configKey: "InventoryLocation",
                type: this.get("integer"),
                optional: false
            },
            {
                configKey: "ExtraPermission",
                type: this.get("string"),
                optional: true
            }
        ]));

        this.register(new ElementTypeComplexList("shopitemlist", this.get("shopitem") as IElementTypeComplex,
        {}, (config: object, configKey: string) => ""));

        this.register(new ElementTypeComplex("shop", [
            {
                configKey: "ShopName",
                type: this.get("string"),
                optional: false
            },
            {
                configKey: "DisplayName",
                type: this.get("string"),
                optional: false
            },
            {
                configKey: "Command",
                type: this.get("string"),
                optional: true
            },
            {
                configKey: "signs/text",
                type: this.get("string"),
                optional: false
            },
            {
                configKey: "signs/NeedsPermissionToCreateSign",
                type: this.get("boolean"),
                optional: false
            },
            {
                configKey: "shop",
                type: this.get("shopitemlist"),
                optional: false
            }
        ]))

    }


    



}