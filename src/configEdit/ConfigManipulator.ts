import { IElementType } from '@/data/ElementTypeModel';
import { elementTypes } from '@/data/ElementTypes';

class ConfigManipulator {


    
    private getLine(configText: string, index: number): string {
        let startPosition = configText.substring(0, index).lastIndexOf("\n");
        if(startPosition == -1){
            startPosition = 0;
        }
        let endPosition = configText.indexOf("\n", index);
        if(endPosition == -1){
            endPosition = configText.length;
        }
        return configText.substring(startPosition, endPosition);
    }

    
    public getPath(configText: string, index: number): string {
        //TODO
        return "todo";
    }
    
    public getElementType(path: string): IElementType {
        //TODO: Use ElementType tree to determine ElementType via path
        return elementTypes.get("string");
    }

    public getIndex(configText: string, path: string): number {
        //TODO
        return 0;
    }


}

export const manipulator = new ConfigManipulator();