export enum ElementTypeClass{

    /** 
     * Simple ElementTypes can be directly modified in the QuickEdit panel. 
     * Examples are String, Double, List<String>, Material, PotionEffect, etc.
     * 
     * They are hardcoded in the tool.
     * There are two kinds of simple ElementTypes: ElementTypeSimple and ElementTypeSimpleAutocomplete.
     * The second type additionally provides a list of possible options (probably just used for a TextField),
     * which are used by QuickEdit to provide autocompletion suggestions.
     * 
     * */
    Simple,

    /**
     * Complex ElementTypes consist of an array of sub-ElementTypes.
     * For example a shop is a complex ElementType, consisting of for example 
     * ShopName (Simple ElementType), Shopitems (List_Complex ElementType), etc.
     * 
     * The QuickEdit panel provides a general solution to handle any complex ElementType.
     * All sub-elements are listed in the QuickEdit window:
     * - Simple sub-elements can directly be modified in the same window (String, Double, List<String>)
     * - Complex sub-elements can be clicked, to navigate one level down the hierarchy, to be able to modify the complex sub-element
     * - Special sub-elements can be clicked, to navigate one level down the hierarchy, where a custom QuickEdit panel is shown
     */
    Complex,

    /**
     * Elements of that type consist of a list of elements of a defined complex ElementType.
     * For example the ShopItem list of every shop uses this type (list of Shopitems).
     * 
     * The QuickEdit panel provides a general solution to handle any complex ElementType list.
     * It shows a plain list/grid of all existing elements (showing their name / id).
     * Elements can be removed from the list and new elements added to the list via QuickEdit GUI.
     */
    List_Complex,

}

//Every ElementType implements this interface.
export interface IElementType{
    name: string;
    class: ElementTypeClass
}

export interface IElementTypeSimple extends IElementType{
}

export interface IElementTypeSimpleAutocomplete extends IElementTypeSimple{
}

export interface IElementTypeProperty{
    configKey: string
    type: IElementType
}

export interface IElementTypeComplex extends IElementType{
    properties: IElementTypeProperty[]
}

export interface IElementTypeComplexList extends IElementType{
    type: IElementTypeComplex
    defaultElement: object //default element which is created when "add element" action is executed on list
    getElementDisplayInformation(config: object, configKey: string): string //raw text to display. In future maybe name of icon to display.
}


export class ElementTypeSimple implements IElementTypeSimple{
    name: string
    class: ElementTypeClass = ElementTypeClass.Simple

    constructor(name: string){
        this.name = name;
    }
}

export class ElementTypeSimpleAutocomplete extends ElementTypeSimple implements IElementTypeSimpleAutocomplete{
    possibilities: string[]

    constructor(name: string, possibilities: string[]){
        super(name);
        this.possibilities = possibilities;
    }
}


export class ElementTypeComplex implements IElementType{
    name: string
    properties: IElementTypeProperty[]
    class: ElementTypeClass = ElementTypeClass.Complex

    constructor(name: string, properties: IElementTypeProperty[]){
        this.name = name;
        this.properties = properties;
    }
}

export class ElementTypeComplexList implements IElementTypeComplexList{
    name: string
    class: ElementTypeClass = ElementTypeClass.List_Complex
    type: IElementTypeComplex
    defaultElement: object
    elementInfoFunction: (config: object, configKey: string) => string

    constructor(name: string, type: IElementTypeComplex, defaultElement: object, elementInfoFunction: (config: object, configKey: string) => string){
        this.name = name;
        this.type = type;
        this.defaultElement = defaultElement;
        this.elementInfoFunction = elementInfoFunction;
    }

    getElementDisplayInformation(config: object, configKey: string): string{
        return this.elementInfoFunction.call(config, configKey);
    }
}
