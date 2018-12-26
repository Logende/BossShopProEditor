import { IElementType, ElementTypeClass, IElementTypeSimple, ElementTypeSimple, ElementTypeSimpleAutocomplete, IElementTypeComplexList, ElementTypeComplex, ElementTypeComplexList, IElementTypeComplex, ElementTypeDependent, IElementTypeDependent } from '@/data/ElementTypeModel';
import { elementTypes } from '@/data/ElementTypes';
import _ from "lodash";
import { pathToString } from "@/pathHelper";

class EditorData {

    public shopRoot: IElementType = elementTypes.get("shop");
    // TODO: Manage enum values here and provide user a choice between different versions
    // TODO: Also load data from relative text / config files, rather than hardcoding them

    public getElementType(path: Array<string|number>, config: object): IElementType {
        return this.getElementTypeStep([], path, config, this.shopRoot);
    }

    private getElementTypeStep(pathCurrent: Array<string|number>, pathNext: Array<string|number>, config: object, subtreeRoot: IElementType): IElementType {
        // If the last step of the path is reached: Return the selected ElementType
        if (pathNext.length === 0) {

            switch (subtreeRoot.class) {
                case ElementTypeClass.Simple:
                case ElementTypeClass.Simple_Autocomplete:
                case ElementTypeClass.Complex:
                case ElementTypeClass.List_Complex:
                    return subtreeRoot;

                case ElementTypeClass.Dependent:
                    const elementTypeDependent = subtreeRoot as IElementTypeDependent;
                    const pathText = pathToString(pathCurrent.slice(0, - 1).concat([elementTypeDependent.dependencyConfigKey])) || "";
                    const dependentString = _.at(config as any, [pathText])[0];
                    if (dependentString === undefined) {
                        console.log("dependency of elementtpe dependent missing, having pathText " + pathText + ".");
                        return elementTypes.get("none");
                    }
                    return elementTypeDependent.dependencyToElementType.get(dependentString.toLowerCase())!;


            }
            throw new Error("Unknown ElementTypeClass: '" + subtreeRoot.class + "'.");
        }

        // Handle the different ElementTypes properly
        switch (subtreeRoot.class) {

            // Should not happen: Simple elements should be the last step of a path
            case ElementTypeClass.Simple:
                console.log("Subtree root has ElementTypeClass Simple, although the end of the path is not reached yet.");
                return elementTypes.get("none");

            // Complex ElementType. Find property which matches path section and continue search.
            case ElementTypeClass.Complex:
                const elementTypeComplex = subtreeRoot as IElementTypeComplex;

                // The key of a property could be multiple path sections combined. Therefor all possible paths are tried, starting with one path section, up to the complete path.
                for (let i = 0; i < pathNext.length; i++) {
                    const pathSection = pathNext.slice(0, i + 1).join(".");
                    for (const property of elementTypeComplex.properties) {
                        if (property.configKey === pathSection) {
                            return this.getElementTypeStep(pathCurrent.concat(pathNext.slice(0, i + 1)), pathNext.slice(i + 1), config, property.type);
                        }
                    }
                }
                console.log("No property of the selected complex ElementType matches the selected path '" + pathCurrent.concat(pathNext).join(".") + "'.");
                return elementTypes.get("none");

            // Complex list. Every path section results in the same ElementType.
            case ElementTypeClass.List_Complex:
                const elementTypeListComplex = subtreeRoot as IElementTypeComplexList;
                // Path section does not matter: Anything allowed
                return this.getElementTypeStep(pathCurrent.concat(pathNext.slice(0, 1)), pathNext.slice(1), config, elementTypeListComplex.type);

            // ElementType depends on other config values.
            case ElementTypeClass.Dependent:
        }

        console.log("Unknown ElementType. Probably Array element.");
        return elementTypes.get("none");
    }

}

export const editorData = new EditorData();
