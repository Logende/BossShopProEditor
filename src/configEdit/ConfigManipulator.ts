import { IElementType, ElementTypeClass, IElementTypeComplex, IElementTypeProperty, IElementTypeComplexList } from '@/data/ElementTypeModel';
import { elementTypes } from '@/data/ElementTypes';
import { editorData } from '@/data/EditorData';

class ConfigManipulator {

    public getPath(configText: string, indexLine: number): Array<string> {
        const line = this.getLine(configText, indexLine);

        // If empty line is selected no path is returned.
        if (line.length === 0) {
            return [];
        }

        // linePathText is the key of the selected line (without whitespaces on left and value on right)
        const linePathText = this.cutPathText(line);
        
        // If the line is part of an array, the path of the array is determined and returned
        if (linePathText.startsWith("-")) {
            const entryAbove = this.getEntryAbove(configText, indexLine);
            return this.getPath(configText, entryAbove.indexLine);
        }

        // If the selected line does not have parents: Directly return it
        if (this.getLevel(line) === 0) {
            return [linePathText];
            
        } else {
            // If it has parents, calculate the parent path and return parent + child path
            const entryParent = this.getEntryParent(configText, indexLine);
            if (entryParent.indexLine === -1) {
                throw new Error("Line '" + line + "' with index '" + indexLine + "' is not at level 0 but does not have parent.");
            }
            const path = this.getPath(configText, entryParent.indexLine);
            path.push(linePathText);
            return path;
        }
    }


    public getIndex(configText: string, path: string): number {
        // TODO
        return 0;
    }

    private getLine(configText: string, indexLine: number): string {
        let startPosition = configText.substring(0, indexLine).lastIndexOf("\n");
        if (startPosition === -1) {
            startPosition = 0;
        } else {
            startPosition += 1;
        }
        let endPosition = configText.indexOf("\n", indexLine);
        if (endPosition === -1) {
            endPosition = configText.length;
        }
        return configText.substring(startPosition, endPosition);
    }

    private getLevel(line: string) {
        return line.search(/\S/) / 2; // indention / 2
    }

    private cutPathText(line: string): string {
        const level = this.getLevel(line);
        const indexColon = line.indexOf(":");
        if (indexColon === -1) {
            return line.substring(level * 2);
        }
        return line.substring(level * 2, indexColon);
    }

    private getEntryAbove(configText: string, indexLine: number): {indexLine: number, line: string|null} {
        const indexLineAbove = configText.substring(0, indexLine).lastIndexOf("\n") - 1;
        if (indexLineAbove === -1) {
            return {indexLine: -1, line: null};
        } else {
            return {indexLine: indexLineAbove, line: this.getLine(configText, indexLineAbove)};
        }
    }

    private getEntryParent(configText: string, indexLine: number): {indexLine: number, line: string|null} {
        const line = this.getLine(configText, indexLine);
        const levelLine = this.getLevel(line);
        const levelParentLine = levelLine - 1;
        if (levelParentLine < 0) { // has no parent line because own indention is 0/1
            return {indexLine: -1, line: null};
        }
        let entryAbove = this.getEntryAbove(configText, indexLine);
        while (entryAbove.indexLine !== -1) {
            const levelLineAbove = this.getLevel(entryAbove.line!);
            if (levelLineAbove === levelParentLine) {
                return entryAbove;
            }

            entryAbove = this.getEntryAbove(configText, entryAbove.indexLine);
        }
        return {indexLine: -1, line: null};
    }

}

export const manipulator = new ConfigManipulator();
