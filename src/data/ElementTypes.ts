import "@/data/ElementTypeModel";
import { IElementType, ElementTypeClass, IElementTypeSimple, ElementTypeSimple, ElementTypeSimpleAutocomplete, IElementTypeComplexList, ElementTypeComplex, ElementTypeComplexList } from '@/data/ElementTypeModel';

export class ElementTypes {


    //TODO: All all elementTypes to map and access existing elementTypes via map

    private static shopRoot: IElementType = ElementTypes.generateElementTypes();
    private static elementTypesSimple = {
        string: new ElementTypeSimple("string"),
        double: new ElementTypeSimple("double"),
        integer: new ElementTypeSimple("integer"),
        list_string: new ElementTypeSimple("list_string"),
        //TODO: replace example names by actual lists of data names
        material: new ElementTypeSimpleAutocomplete("material", ["stone", "log"]),
        potioneffect: new ElementTypeSimpleAutocomplete("potioneffect", ["poison", "heal"]),
        enchantment: new ElementTypeSimpleAutocomplete("enchantment", ["sharpness", "unbreaking"])
    };

    private static elementTypeSpecialItem = new ElementTypeComplex("item", [
        {
            configKey: "",
            type: ElementTypes.elementTypesSimple.list_string
        }
    ]);

    private static elementTypeSpecialListItem = new ElementTypeComplexList("list_item", ElementTypes.elementTypeSpecialItem, ["type:stone", "amount:1"],
    (config: object, configKey: string) => "todo");
    
    private static elementTypeSpecialNames = ["item", "shopitemlist"];


    private static generateElementTypes(): IElementType{
        //TODO
        return {
            class: ElementTypeClass.Simple,
            name: "string"
        }
    }


}