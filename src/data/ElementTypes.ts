import "@/data/ElementTypeModel";
import { IElementType, ElementTypeClass, IElementTypeSimple, ElementTypeSimple, ElementTypeSimpleAutocomplete, IElementTypeComplexList } from '@/data/ElementTypeModel';

export class ElementTypes {


    private static shopRoot: IElementType = ElementTypes.generateElementTypes();
    private static elementTypesSimple = {
        string: new ElementTypeSimple("string"),
        double: new ElementTypeSimple("double"),
        integer: new ElementTypeSimple("integer"),
        list_string: new ElementTypeSimple("list_string"),
        list_item: new ElementTypeSimple("list_string"),
        //TODO: replace example names by actual lists of data names
        material: new ElementTypeSimpleAutocomplete("material", ["stone", "log"]),
        potioneffect: new ElementTypeSimpleAutocomplete("potioneffect", ["poison", "heal"]),
        enchantment: new ElementTypeSimpleAutocomplete("enchantment", ["sharpness", "unbreaking"])
    };
    
    private static elementTypeSpecialNames = ["item", "shopitemlist"];


    private static generateElementTypes(): IElementType{
        //TODO
        return {
            class: ElementTypeClass.Simple,
            name: "string"
        }
    }


}