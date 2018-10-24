import { IElementType, ElementTypeClass, IElementTypeComplex, IElementTypeProperty, IElementTypeComplexList } from '@/data/ElementTypeModel';
import { elementTypes } from '@/data/ElementTypes';
import { editorData } from '@/data/EditorData';

class ConfigManipulator {

    public getPath(configText: string, indexLine: number): Array<string|number> {
        if (indexLine === undefined) {
            throw new Error("Unable to get path: indexLine undefined.");
        }

        const line = this.getLine(configText, indexLine);

        // If empty line is selected no path is returned.
        if (line.length === 0) {
            return [];
        }

        // linePathText is the key of the selected line (without whitespaces on left and value on right)
        const linePathText = this.cutPathText(line);

        // If the line is part of an array, the path of the array is determined and returned
        if (linePathText.startsWith("-")) {
            const entryAbove = this.getEntryNeighbour(configText, indexLine, true);
            return this.getPath(configText, entryAbove.indexLine);
            // TODO: allow directly selecting an array element (maybe only in the case of an array which contains elements of type array)
        }

        // If the selected line does not have parents: Directly return it
        if (this.getLevel(line) === 0) {
            return [linePathText];

        } else {
            // If it has parents, calculate the parent path and return parent + child path
            const entryParent = this.getEntryParent(configText, indexLine);
            if (entryParent.indexLine === - 1) {
                throw new Error("Line '" + line + "' with index '" + indexLine + "' is not at level 0 but does not have parent.");
            }
            const path = this.getPath(configText, entryParent.indexLine);
            path.push(linePathText);
            return path;
        }
    }

    public getIndex(configText: string, path: Array<string|number>, indexLineCurrent: number = -1): number {
        if (path.length === 0) {
            return indexLineCurrent;
        }
        // Try every possible path until a child is found or the last path tried
        for (let i = 0; i < path.length; i++) {
            const pathSection = path.slice(0, i + 1).join(".");
            const entryChild = this.getEntryChild(configText, indexLineCurrent, pathSection);
            if (entryChild.indexLine !== - 1) { // child with given pathSection was found
                return this.getIndex(configText, path.slice(i + 1), entryChild.indexLine);
            }
        }
        return -1;
    }

    private getLine(configText: string, indexLine: number): string {
        let startPosition = configText.substring(0, indexLine).lastIndexOf("\n");
        if (startPosition === - 1) {
            startPosition = 0;
        } else {
            startPosition += 1;
        }
        let endPosition = configText.indexOf("\n", indexLine);
        if (endPosition === - 1) {
            endPosition = configText.length;
        }
        return configText.substring(startPosition, endPosition);
    }

    private getLevel(line: string) {
        return line.search(/\S/) / 2; // indention / 2
    }

    private cutPathText(line: string): string {
        line = line.replace(/'|"/g, "");
        const level = this.getLevel(line);
        const indexColon = line.indexOf(":");
        if (indexColon === -1) {
            return line.substring(level * 2);
        }
        return line.substring(level * 2, indexColon);
    }

    /**
     * Returns the first parent of the selected line.
     * @param configText Raw config text.
     * @param indexLine Index of the selected line to search the parent from.
     */
    private getEntryParent(configText: string, indexLine: number): {indexLine: number, line: string|null} {
        const line = this.getLine(configText, indexLine);
        const levelLine = this.getLevel(line);
        const levelParentLine = levelLine - 1;
        if (levelParentLine < 0) { // invalid parent line level
            return {indexLine: - 1, line: null};
        }
        const specificCheck: (indexLine: number, line: string|null) => boolean = (indexNeighbourLine, lineNeighbour) => {
            const levelNeighbourLine = this.getLevel(lineNeighbour!);
            return levelNeighbourLine === levelParentLine;
        };
        return this.getEntryNeighbourSpecific(configText, indexLine, true, specificCheck);
    }

    /**
     * Returns the first child which matches the given config key.
     * @param configText Raw config text.
     * @param indexLine Index of the current line to search the child of. Use -1 if there is no line selected yet and a root element is searched.
     * @param pathSection Configuration path section (key) of the child to find.
     */
    private getEntryChild(configText: string, indexLine: number, pathSection: string): {indexLine: number, line: string|null} {
        let levelChildLine = 0;
        if (indexLine !== - 1) {
            const line = this.getLine(configText, indexLine);
            const levelLine = this.getLevel(line);
            levelChildLine = levelLine + 1;
        }
        const specificCheck = (indexNeighbourLine: number, lineNeighbour: string) => {
            const levelNeighbourLine = this.getLevel(lineNeighbour!);
            return levelNeighbourLine === levelChildLine && this.cutPathText(lineNeighbour) === pathSection;
        };
        return this.getEntryNeighbourSpecific(configText, indexLine, false, specificCheck);
    }

    private getEntryNeighbourSpecific(configText: string, indexLine: number, directionUp: boolean, specificCheck: (indexLine: number, line: string) => boolean): {indexLine: number, line: string|null} {
        let entryNeighbour = this.getEntryNeighbour(configText, indexLine, directionUp);
        while (entryNeighbour.indexLine !== - 1) {
            if (specificCheck.call(this, entryNeighbour.indexLine, entryNeighbour.line)) {
                return entryNeighbour;
            }
            entryNeighbour = this.getEntryNeighbour(configText, entryNeighbour.indexLine, directionUp);
        }
        return {indexLine: -1, line: null};
    }

    private getEntryNeighbour(configText: string, indexLine: number, directionUp: boolean): {indexLine: number, line: string|null} {
        if (directionUp) {
            const indexLineNeighbour = configText.substring(0, indexLine).lastIndexOf("\n") - 1;
            if (indexLineNeighbour !== - 1 - 1) {
                return {indexLine: indexLineNeighbour, line: this.getLine(configText, indexLineNeighbour)};
            }
        } else {
            const indexLineNeighbour = configText.substring(indexLine).indexOf("\n") + indexLine + 1;
            if (indexLineNeighbour !== - 1 + indexLine + 1) {
                return {indexLine: indexLineNeighbour, line: this.getLine(configText, indexLineNeighbour)};
            }
        }
        return {indexLine: -1, line: null};
    }

}

export const manipulator = new ConfigManipulator();
