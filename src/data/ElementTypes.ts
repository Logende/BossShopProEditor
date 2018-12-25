import { IElementType, ElementTypeSimple, ElementTypeSimpleAutocomplete,
    ElementTypeComplex, ElementTypeComplexList, ElementTypeDependent,
    ElementTypeSimpleAutocompleteDependency, IElementTypeProperty } from '@/data/ElementTypeModel';
import _ from "lodash";
import YAML from 'yamljs';
import material_1_13 from '@/data/mc_1_13/material.txt';
import enchantment_1_13 from '@/data/mc_1_13/enchantment.txt';
import potioneffect_1_13 from '@/data/mc_1_13/potioneffect.txt';
import elementTypes_2_0_0 from '@/data/bsp_2_0/elementTypes.yml';
import rewardtype_2_0_0 from '@/data/bsp_2_0/rewardtype.txt';
import pricetype_2_0_0 from '@/data/bsp_2_0/pricetype.txt';

class ElementTypes {

    // element types which should get custom QuickEdit support
    public elementTypeSpecialNames = ["item", "shopitemlist"];

    private elementTypes: Map<string, IElementType> = new Map<string, IElementType>();

    constructor() {
        //
        // Init simple ElementTypes
        //
        this.register(new ElementTypeSimple("none"));
        this.register(new ElementTypeSimple("string"));
        this.register(new ElementTypeSimple("string_formatted"));
        this.register(new ElementTypeSimple("boolean"));
        this.register(new ElementTypeSimple("double"));
        this.register(new ElementTypeSimple("integer"));
        this.register(new ElementTypeSimple("list_string"));
        this.register(new ElementTypeSimple("item"));
        // TODO: replace example names by actual lists of data names

        //
        // Init special ElementTypes
        //
        this.register(new ElementTypeComplexList("list_item", this.get("item"),
        ["type:stone", "amount:1"], (config: object, configKey: string) => "todo"));

        //
        // Init shop ElementTypes
        //
        this.loadElementTypes();
    }

    public loadElementTypes(bspVersion: string = "2_0", mcVersion: string = "1_13"): IElementType[] {
        let rewardtype: string[] = [];
        let pricetype: string[] = [];
        let material: string[] = [];
        let enchantment: string[] = [];
        let potioneffect: string[] = [];
        let config = {};

        if (mcVersion === "1_13") {
            material = material_1_13.split(/[\r\n]+/);
            enchantment = enchantment_1_13.split(/[\r\n]+/);
            potioneffect = potioneffect_1_13.split(/[\r\n]+/);
        }
        if (bspVersion === "2_0") {
            rewardtype = rewardtype_2_0_0.split(/[\r\n]+/);
            pricetype = pricetype_2_0_0.split(/[\r\n]+/);
            config = YAML.parse(elementTypes_2_0_0);
        }

        this.register(new ElementTypeSimpleAutocomplete("material", material));
        this.register(new ElementTypeSimpleAutocomplete("potioneffect", potioneffect));
        this.register(new ElementTypeSimpleAutocomplete("enchantment", enchantment));
        this.register(new ElementTypeSimpleAutocompleteDependency("rewardtype", rewardtype, "Reward"));
        this.register(new ElementTypeSimpleAutocompleteDependency("pricetype", pricetype, "Price"));


        const localElementTypes: IElementType[] = [];
        for (const key of Object.keys(config)) {
            const elementType = this.loadElementType(_.at(config, [key])[0] as any, key);
            this.register(elementType);
            localElementTypes.push(elementType);
        }
        return localElementTypes;
    }

    public has(name: string): boolean {
        return this.elementTypes.has(name.toLowerCase());
    }

    public get(name: string): IElementType {
        if (!this.elementTypes.has(name.toLowerCase())) {
            throw new Error("ElementType with name '" + name + "' not found.");
        }
        return this.elementTypes.get(name.toLowerCase())!;
    }

    private loadElementType(elementTypeConfig: any, key: string): IElementType {
        const type = _.at(elementTypeConfig, ["type"])[0] as string;

        if (type === ("complex")) {
            const properties: IElementTypeProperty[] = [];
            const propertiesConfig = _.at(elementTypeConfig, ["properties"])[0] as any;
            for (const propertyKey of Object.keys(propertiesConfig)) {
                const propertyElementType = this.loadElementType(_.at(propertiesConfig, [propertyKey])[0] as any, propertyKey);
                this.register(propertyElementType);
                const propertyConfig = _.at(propertiesConfig, [propertyKey])[0] as any;
                const propertyOptional: boolean =  _.has(propertyConfig, ["optional"]) ? _.at(propertyConfig, ["optional"])[0] as boolean : false;
                const configKey: string =  _.has(propertyConfig, ["configKey"]) ? _.at(propertyConfig, ["configKey"])[0] as string : propertyKey;
                const property: IElementTypeProperty = {
                    configKey,
                    optional: propertyOptional,
                    type: propertyElementType
                };
                properties.push(property);
            }
            const name =  _.has(elementTypeConfig, ["name"]) ?  _.at(elementTypeConfig, ["name"])[0] as string : key;
            const renameable =  _.has(elementTypeConfig, ["renameable"]) ?  _.at(elementTypeConfig, ["renamable"])[0] as boolean : false;
            const deleteable =  _.has(elementTypeConfig, ["deleteable"]) ?  _.at(elementTypeConfig, ["deleteable"])[0] as boolean : false;
            return new ElementTypeComplex(name, properties, renameable, deleteable);

        } else if (type.startsWith("existing:")) {
            return this.get(type.split(":")[1]);

        } else if (type === ("dependent")) {
            const dependency = _.at(elementTypeConfig, ["dependency"])[0] as string;
            const map: Map<string, string> = new Map<string, string>();
            const mapConfig = _.at(elementTypeConfig, ["map"])[0] as any;
            for (const mapKey of Object.keys(mapConfig)) {
                const value =  _.at(mapConfig, [mapKey])[0] as string;
                map.set(mapKey, value);
            }
            const name =  _.has(elementTypeConfig, ["name"]) ?  _.at(elementTypeConfig, ["name"])[0] as string : key;
            const renameable =  _.has(elementTypeConfig, ["renameable"]) ?  _.at(elementTypeConfig, ["renamable"])[0] as boolean : false;
            const deleteable =  _.has(elementTypeConfig, ["deleteable"]) ?  _.at(elementTypeConfig, ["deleteable"])[0] as boolean : false;
            return new ElementTypeDependent(name, dependency, map, renameable, deleteable);

        } else if (type === ("complexlist")) {
            const elementsConfig = _.at(elementTypeConfig, ["elements"])[0] as any;
            const elementTypeKey: string = Object.keys(elementsConfig)[0];
            const elementType = this.loadElementType(_.at(elementsConfig, [elementTypeKey])[0] as any, elementTypeKey);
            this.register(elementType);
            const transformationFunction = (config: object, configKey: string) => {
                return configKey; // Note: just a temporary solution to have something displayed
            };
            const name =  _.has(elementTypeConfig, ["name"]) ?  _.at(elementTypeConfig, ["name"])[0] as string : key;
            const renameable =  _.has(elementTypeConfig, ["renameable"]) ?  _.at(elementTypeConfig, ["renamable"])[0] as boolean : false;
            const deleteable =  _.has(elementTypeConfig, ["deleteable"]) ?  _.at(elementTypeConfig, ["deleteable"])[0] as boolean : false;
            const defaultElement = _.at(elementTypeConfig, ["default"])[0] as any;
            return new ElementTypeComplexList(name, elementType, defaultElement, transformationFunction, renameable, deleteable);
        }
        throw Error("Unknown ElementType type: ' " + type + "'.");
    }

    private register(elementType: IElementType) {
        this.elementTypes.set(elementType.name.toLowerCase(), elementType);
    }

}

export const elementTypes = new ElementTypes();
