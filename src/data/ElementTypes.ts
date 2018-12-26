import { IElementType, ElementTypeSimple, ElementTypeSimpleAutocomplete,
    ElementTypeComplex, ElementTypeComplexList, ElementTypeDependent,
    ElementTypeSimpleAutocompleteDependency, IElementTypeProperty } from '@/data/ElementTypeModel';
import _ from "lodash";
import { enums } from './Enums';
import { data } from './Data';

class ElementTypes {

    // element types which should get custom QuickEdit support
    public elementTypeSpecialNames = ["item", "shopitemlist"];
    private m: Map<string, IElementType> = new Map<string, IElementType>();



    public get map(): Map<string, IElementType> {
        if (!data.wasUpdatedElementTypes(true)) {
            return this.m;
        }
        console.log("generating new element types.");

        const config = data.elementTypesConfig;

        const localElementTypes: IElementType[] = [];
        this.m.clear();
        for (const key of Object.keys(config)) {
            const elementType = this.loadElementType(_.at(config, [key])[0] as any, key, this.m);
            this.m.set(elementType.name.toLowerCase(), elementType);
            localElementTypes.push(elementType);
        }
        return this.m;
    }

    public has(name: string): boolean {
        return this.map.has(name.toLowerCase());
    }

    public get(name: string): IElementType {
        if (!this.map.has(name.toLowerCase())) {
            throw new Error("ElementType with name '" + name + "' not found.");
        }
        return this.map.get(name.toLowerCase())!;
    }

    private loadElementType(elementTypeConfig: any, key: string, elementTypes: Map<string, IElementType>): IElementType {
        const type = _.at(elementTypeConfig, ["type"])[0] as string;

        if (type === ("complex")) {
            const properties: IElementTypeProperty[] = [];
            const propertiesConfig = _.at(elementTypeConfig, ["properties"])[0] as any;
            for (const propertyKey of Object.keys(propertiesConfig)) {
                const propertyElementType = this.loadElementType(_.at(propertiesConfig, [propertyKey])[0] as any, propertyKey, elementTypes);
                elementTypes.set(propertyElementType.name.toLowerCase(), propertyElementType);
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
            const description = _.at(elementTypeConfig, ["description"])[0] as string;
            const renameable =  _.has(elementTypeConfig, ["renameable"]) ?  _.at(elementTypeConfig, ["renamable"])[0] as boolean : false;
            const deleteable =  _.has(elementTypeConfig, ["deleteable"]) ?  _.at(elementTypeConfig, ["deleteable"])[0] as boolean : false;
            return new ElementTypeComplex(name, description, properties, renameable, deleteable);

        } else if (type.startsWith("simple:")) {
            const simpleType = type.split(":")[1];
            const description = _.at(elementTypeConfig, ["description"])[0] as string;
            const elementType = new ElementTypeSimple(simpleType, description);
            return elementType;

        } else if (type.startsWith("simple_autocomplete:")) {
            const simpleType = type.split(":")[1];
            const description = _.at(elementTypeConfig, ["description"])[0] as string;
            const autocomplete = _.at(elementTypeConfig, ["autocomplete"])[0] as string;
            const possibilities = enums.get(autocomplete)!;
            const elementType = new ElementTypeSimpleAutocomplete(simpleType, description, possibilities);
            return elementType;

        } else if (type.startsWith("simple_autocomplete_dependency:")) {
            const simpleType = type.split(":")[1];
            const description = _.at(elementTypeConfig, ["description"])[0] as string;
            const autocomplete = _.at(elementTypeConfig, ["autocomplete"])[0] as string;
            const possibilities = enums.get(autocomplete)!;
            const dependent = _.at(elementTypeConfig, ["dependent"])[0] as string;
            const elementType = new ElementTypeSimpleAutocompleteDependency(simpleType, description, possibilities, dependent);
            return elementType;

        } else if (type.startsWith("existing:")) {
            return this.get(type.split(":")[1]);

        } else if (type === ("dependent")) {
            const dependency = _.at(elementTypeConfig, ["dependency"])[0] as string;
            const map: Map<string, IElementType> = new Map<string, IElementType>();
            const mapConfig = _.at(elementTypeConfig, ["map"])[0] as any;
            for (const mapKey of Object.keys(mapConfig)) {
                const propertyConfig =  _.at(mapConfig, [mapKey])[0] as any;
                const mapElementType = this.loadElementType(propertyConfig, mapKey, elementTypes);
                elementTypes.set(mapElementType.name.toLowerCase(), mapElementType);
                map.set(mapKey, mapElementType);
            }
            const name =  _.has(elementTypeConfig, ["name"]) ?  _.at(elementTypeConfig, ["name"])[0] as string : key;
            const description = _.at(elementTypeConfig, ["description"])[0] as string;
            const renameable =  _.has(elementTypeConfig, ["renameable"]) ?  _.at(elementTypeConfig, ["renamable"])[0] as boolean : false;
            const deleteable =  _.has(elementTypeConfig, ["deleteable"]) ?  _.at(elementTypeConfig, ["deleteable"])[0] as boolean : false;
            return new ElementTypeDependent(name, description, dependency, map, renameable, deleteable);

        } else if (type === ("complexlist")) {
            const elementsConfig = _.at(elementTypeConfig, ["elements"])[0] as any;
            const elementTypeKey: string = Object.keys(elementsConfig)[0];
            const elementType = this.loadElementType(_.at(elementsConfig, [elementTypeKey])[0] as any, elementTypeKey, elementTypes);
            elementTypes.set(elementType.name.toLowerCase(), elementType);
            const transformationFunction = (config: object, configKey: string) => {
                return configKey; // Note: just a temporary solution to have something displayed
            };
            const name =  _.has(elementTypeConfig, ["name"]) ?  _.at(elementTypeConfig, ["name"])[0] as string : key;
            const description = _.at(elementTypeConfig, ["description"])[0] as string;
            const renameable =  _.has(elementTypeConfig, ["renameable"]) ?  _.at(elementTypeConfig, ["renamable"])[0] as boolean : false;
            const deleteable =  _.has(elementTypeConfig, ["deleteable"]) ?  _.at(elementTypeConfig, ["deleteable"])[0] as boolean : false;
            const defaultElement = _.at(elementTypeConfig, ["default"])[0] as any;
            return new ElementTypeComplexList(name, description, elementType, defaultElement, transformationFunction, renameable, deleteable);
        }
        throw Error("Unknown ElementType type: ' " + type + "'.");
    }

}

export const elementTypes = new ElementTypes();
