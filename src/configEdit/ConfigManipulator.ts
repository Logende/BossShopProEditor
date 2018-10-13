import { IElementType } from '@/data/ElementTypeModel';
import { elementTypes } from '@/data/ElementTypes';

class ConfigManipulator {

    public getPath(configText: string, indexLine: number): string|null {
        const line = this.getLine(configText, indexLine);
        const linePathText = this.cutPathText(line);
        if (configText.length === 0) {
            return null;
        }
        if (linePathText.startsWith("-")) { // part of list. Now first of all find actual path start.
            const entryAbove = this.getEntryAbove(configText, indexLine);
            return this.getPath(configText, entryAbove.indexLine);
        }

        if (this.getLevel(line) === 0) {
            return linePathText;
        } else {
            const entryParent = this.getEntryParent(configText, indexLine);
            if (entryParent.indexLine === -1) {
                throw new Error("Line '" + line + "' with index '" + indexLine + "' is not at level 0 but does not have parent.");
            }
            return this.getPath(configText, entryParent.indexLine) + "/" + linePathText;
        }
    }

    public getElementType(path: string): IElementType {
        // TODO: Use ElementType tree to determine ElementType via path
        return elementTypes.get("string");
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

    private cutPathText(line: string) {
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
