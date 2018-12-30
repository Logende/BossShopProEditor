export enum ElementTypeClass {

    /**
     * Simple ElementTypes can be directly modified in the QuickEdit panel.
     * Examples are String, Double, List<String>, Material, PotionEffect, etc.
     *
     * They are hardcoded in the tool.
     * There are two kinds of simple ElementTypes: ElementTypeSimple and ElementTypeSimpleAutocomplete.
     * The second type additionally provides a list of possible options (probably just used for a TextField),
     * which are used by QuickEdit to provide autocompletion suggestions.
     *
     */
    Simple,

    /**
     * TODO: Describe
     */
    Simple_Autocomplete,

    /**
     * Complex ElementTypes consist of an array of sub-ElementTypes.
     * For example a shop is a complex ElementType, consisting of for example
     * ShopName (Simple ElementType), Shopitems (List_Complex ElementType), etc.
     *
     * The QuickEdit panel provides a general solution to handle any complex ElementType.
     * All sub-elements are listed in the QuickEdit window:
     * - Simple sub-elements can directly be modified in the same window (String, Double, List<String>)
     * - Complex sub-elements can be clicked to navigate one level down the hierarchy, to be able to modify the complex sub-element
     * - Complex lists as sub-elements: All elements displayed, possibility to remove / add. Element ca be clicked to navigate one level down.
     * - Special sub-elements can be clicked to navigate one level down the hierarchy, where a custom QuickEdit panel is shown
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

    /**
     * Elements of that type have a variable ElementType, which depends on an other config entry.
     * For example Reward or Price use this type, because a Reward can for example be a numerical number, an item list, etc.
     *
     * The ConfigEdit panel uses the concretely defined relative config key to find the dependency-text.
     * Next it determines the actual ElementType via contained the text-to-ElementTypenName map.
     *
     * The QuickEdit panel does not have to bother with this ElementTypeClass: It directly gets the real ElementType,
     * which is determined by the ConfigEdit panel.
     */
    Dependent,

}

//
// Interfaces beginning here are relevant for QuickEdit
//
export interface IElementType { // Relevant for QuickEdit
    name: string;
    description: string;
    class: ElementTypeClass;
    renameable: boolean;
    deleteable: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface IElementTypeSimple extends IElementType {
}

export interface IElementTypeSimpleAutocomplete extends IElementTypeSimple {
    possibilities: string[];
}

export interface IElementTypeSimpleAutocompleteDependency extends IElementTypeSimpleAutocomplete {
    dependentConfigKey: string;
}

export interface IElementTypeProperty {
    configKey: string;
    type: IElementType;
    optional: boolean;
}

export interface IElementTypeComplex extends IElementType {
    properties: IElementTypeProperty[];
}

    /**
     * Not an array!
     *
     * Traditional array:
     * item:
     * - "name:my name"
     * - "material:gold_ingot"
     * - "amount:4
     *
     * Complex list:
     * shop:
     *   shopitem_stone:
     *     PriceType: money
     *     Price: 1
     *     RewardType: item
     *     [...]
     *   shopitem_diamond
     *     PriceType: money
     *     Price: 1400
     *     RewardType: item
     *     [...]
     *
     * -> each element of the list has an unique key and
     * the value corresponding to the key is the element of the list,
     * like the elements "shopitem_stone" and "shopitem_diamond" in the example.
     */
export interface IElementTypeComplexList extends IElementType {
    type: IElementType;

    defaultElement: object; // default element which is created when "add element" action is executed on list

    /**
     * Returns raw text to display. In future maybe name of icon to display.
     * @param configSection Configuration section of the list.
     * @param configKey Key of the corresponding element (IElementTypeComplex).
     */
    getElementDisplayInformation(configSection: object, configKey: string): string;
}

//
// Everything below is not relevant for QuickEdit
//
export interface IElementTypeDependent extends IElementType {
    dependencyConfigKey: string;
    dependencyToElementType: Map<string, IElementType>;
}


export class ElementTypeSimple implements IElementTypeSimple {
    public name: string;
    public description: string;
    public class: ElementTypeClass = ElementTypeClass.Simple;
    public renameable: boolean;
    public deleteable: boolean;

    constructor(name: string, description: string, renameable: boolean = false, deleteable: boolean = false) {
        this.name = name;
        this.description = description;
        this.renameable = renameable;
        this.deleteable = deleteable;
    }
}

export class ElementTypeSimpleAutocomplete extends ElementTypeSimple implements IElementTypeSimpleAutocomplete {
    public possibilities: string[];

    constructor(name: string, description: string, possibilities: string[]) {
        super(name, description);
        this.class = ElementTypeClass.Simple_Autocomplete;
        this.possibilities = possibilities;
    }
}

export class ElementTypeSimpleAutocompleteDependency extends ElementTypeSimpleAutocomplete implements IElementTypeSimpleAutocompleteDependency {
    public dependentConfigKey: string;

    constructor(name: string, description: string, possibilities: string[], dependentConfigKey: string) {
        super(name, description, possibilities);
        this.dependentConfigKey = dependentConfigKey;
    }
}


export class ElementTypeComplex implements IElementType {
    public name: string;
    public description: string;
    public properties: IElementTypeProperty[];
    public class: ElementTypeClass = ElementTypeClass.Complex;
    public renameable: boolean;
    public deleteable: boolean;

    constructor(name: string, description: string, properties: IElementTypeProperty[], renameable: boolean = false,
                deleteable: boolean = false) {
        this.name = name;
        this.description = description;
        this.properties = properties;
        this.renameable = renameable;
        this.deleteable = deleteable;
    }
}

export class ElementTypeComplexList implements IElementTypeComplexList {
    public name: string;
    public description: string;
    public class: ElementTypeClass = ElementTypeClass.List_Complex;
    public renameable: boolean;
    public deleteable: boolean;
    public type: IElementType;
    public defaultElement: object;
    public elementInfoFunction: (config: object, configKey: string) => string;

    constructor(name: string, description: string, type: IElementType, defaultElement: object,
                elementInfoFunction: (configSection: object, configKey: string) => string, renameable: boolean = false,
                deleteable: boolean = false) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.renameable = renameable;
        this.deleteable = deleteable;
        this.defaultElement = defaultElement;
        this.elementInfoFunction = elementInfoFunction;
    }

    public getElementDisplayInformation(configSection: object, configKey: string): string {
        return this.elementInfoFunction(configSection, configKey);
    }
}

export class ElementTypeDependent implements IElementTypeDependent {
    public name: string;
    public description: string;
    public class: ElementTypeClass = ElementTypeClass.Dependent;
    public renameable: boolean;
    public deleteable: boolean;
    public dependencyConfigKey: string;
    public dependencyToElementType: Map<string, IElementType>;

    constructor(name: string, description: string, dependencyConfigKey: string, dependencyToElementType: Map<string, IElementType>,
                renameable: boolean = false, deleteable: boolean = false) {
        this.name = name;
        this.description = description;
        this.renameable = renameable;
        this.deleteable = deleteable;
        this.dependencyConfigKey = dependencyConfigKey;
        this.dependencyToElementType = dependencyToElementType;
    }
}
