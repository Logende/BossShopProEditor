import { IElementType, ElementTypeClass, IElementTypeSimple, ElementTypeSimple, ElementTypeSimpleAutocomplete, IElementTypeComplexList, ElementTypeComplex, ElementTypeComplexList, IElementTypeComplex, ElementTypeDependent } from '@/data/ElementTypeModel';
import { elementTypes } from '@/data/ElementTypes';

class EditorData {

    public shopRoot: IElementType = elementTypes.get("shop");
    // TODO: Manage enum values here and provide user a choice between different versions
    // TODO: Also load data from relative text / config files, rather than hardcoding them

    public getElementType(path: Array<string|number>, config: object): IElementType {
        return this.getElementTypeStep(path, config, this.shopRoot);
    }

    public getElementTypeStep(path: Array<string|number>, config: object, subtreeRoot: IElementType): IElementType {
        // If the last step of the path is reached: Return the selected ElementType
        if (path.length === 0) {
            return subtreeRoot;
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
                for (let i = 0; i < path.length; i++) {
                    const pathSection = path.slice(0, i + 1).join(".");
                    for (const property of elementTypeComplex.properties) {
                        if (property.configKey === pathSection) {
                            return this.getElementTypeStep(path.slice(i + 1), config, property.type);
                        }
                    }
                }
                console.log("No property of the selected complex ElementType matches the selected path '" + path.join(".") + "'.");
                return elementTypes.get("none");

            // Complex list. Every path section results in the same ElementType.
            case ElementTypeClass.List_Complex:
                const elementTypeListComplex = subtreeRoot as IElementTypeComplexList;
                // Path section does not matter: Anything allowed
                return this.getElementTypeStep(path.slice(1), config, elementTypeListComplex.type);

            // ElementType depends on other config values.
            case ElementTypeClass.Dependent:
                // TODO
                return elementTypes.get("none");
        }

        throw new Error("Unknown ElementTypeClass: '" + subtreeRoot.class + "'.");
    }

}

export const editorData = new EditorData();
