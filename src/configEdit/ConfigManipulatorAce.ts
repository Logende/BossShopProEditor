import { pathToString } from "@/pathHelper";
import * as ace from 'brace';

class ConfigManipulatorAce {


    public getPath(editor: ace.Editor, pos: ace.Position, arrayIndex: number = -1): Array<string|number> {
        if (pos === undefined) {
            throw new Error("Unable to get path: indexLine undefined.");
        }

        const line = this.getLine(editor, pos);
        // If empty line is selected no path is returned.
        if (line.length === 0) {
            return [];
        }

        // If comment line is selected no path is returned.
        if (this.isCommentLine(line)) {
            return [];
        }

        // linePathText is the key of the selected line (without whitespaces on left and value on right)
        const linePathText = this.cutPathText(line);

        // If the line is part of an array, the path of the array is determined and returned
        if (linePathText.startsWith("-")) {
            const posAbove = this.getPosNeighbour(editor, pos, true, false);
            return this.getPath(editor, posAbove, arrayIndex + 1);
        }

        // If the selected line does not have parents: Directly return it
        if (this.getLevel(line) === 0) {
            return [linePathText];

        } else {
            // If it has parents, calculate the parent path and return parent + child path
            const posParent = this.getPosParent(editor, pos);
            if (posParent.row === - 1) {
                throw new Error("Line '" + line + "' with index '" + posParent.row + "' is not at level 0 but does not have parent.");
            }
            const path = this.getPath(editor, posParent);
            path.push(linePathText);
            if (arrayIndex > -1) {
                path.push(arrayIndex);
            }
            return path;
        }
    }

    public getPos(editor: ace.Editor, path: Array<string|number>, posCurrent: ace.Position = { row: -1, column: -1 }): ace.Position {
        if (path.length === 0) {
            return posCurrent;
        }
        // Try every possible path until a child is found or the last path tried
        for (let i = 0; i < path.length; i++) {
            const pathSection = path.slice(0, i + 1).join(".");
            const posChild = this.getPosChild(editor, posCurrent, pathSection);
            if (posChild.row !== - 1) { // child with given pathSection was found
                return this.getPos(editor, path.slice(i + 1), posChild);
            }
        }
        return { row: -1, column: -1 };
    }

    /**
     * Returns the first duplicated path name (name of a path that exists multiple times) found and undefined else.
     * @param configText Configuration text
     */
    public getPathDuplicate(editor: ace.Editor): string|undefined {
        const keys = [];
        let pos: ace.Position = { row: 0, column: 0 };

        while (pos.column > -1) {
            const line = this.getLine(editor, pos);

            if (!this.isCommentLine(line!)) {
                const path = this.getPath(editor, pos);
                const key: string = pathToString(path)!;
                if (keys.indexOf(key) > -1) {
                    return key;
                }
                keys.push(key);
            }
            pos = this.getPosNeighbour(editor, pos, false, false);
        }
        return undefined;
    }

    public cutPathText(line: string): string {
        line = line.replace(/'|"/g, "");
        const level = this.getLevel(line);
        const indexColon = line.indexOf(":");
        if (indexColon === -1) {
            return line.substring(level * 2);
        }
        return line.substring(level * 2, indexColon);
    }

    private getLine(editor: ace.Editor, pos: ace.Position): string {
        return editor.getSession().doc.getLine(pos.row);
    }

    private getLevel(line: string) {
        return line.search(/\S/) / 2; // indention / 2
    }


    /**
     * Returns the first parent of the selected line.
     */
    private getPosParent(editor: ace.Editor, pos: ace.Position): ace.Position {
        const line = this.getLine(editor, pos);
        const levelLine = this.getLevel(line);
        const levelParentLine = levelLine - 1;
        if (levelParentLine < 0) { // invalid parent line level
            return { row: 0, column: 0};
        }
        const specificCheck = (checkPos: ace.Position) => {
            const lineNeighbour = this.getLine(editor, checkPos);
            const levelNeighbourLine = this.getLevel(lineNeighbour!);
            return levelNeighbourLine === levelParentLine;
        };
        return this.getPosNeighbourSpecific(editor, pos, true, false, specificCheck);
    }

    /**
     * Returns the first child which matches the given config key.
     */
    private getPosChild(editor: ace.Editor, pos: ace.Position, pathSection: string): ace.Position {
        let levelChildLine = 0;
        if (pos.row !== - 1) {
            const line = this.getLine(editor, pos);
            const levelLine = this.getLevel(line);
            levelChildLine = levelLine + 1;
        }
        const specificCheck = (checkPos: ace.Position) => {
            const lineNeighbour = this.getLine(editor, checkPos);
            const levelNeighbourLine = this.getLevel(lineNeighbour);
            return levelNeighbourLine === levelChildLine && this.cutPathText(lineNeighbour) === pathSection;
        };
        return this.getPosNeighbourSpecific(editor, pos, false, false, specificCheck);
    }

    private getPosNeighbourSpecific(editor: ace.Editor, pos: ace.Position, directionUp: boolean, includeCommentLines: boolean, specificCheck: (pos: ace.Position) => boolean): ace.Position {
        let posNeighbour = this.getPosNeighbour(editor, pos, directionUp, includeCommentLines);
        while (posNeighbour.row !== - 1) {
            if (specificCheck(posNeighbour)) {
                return posNeighbour;
            }
            posNeighbour = this.getPosNeighbour(editor, posNeighbour, directionUp, includeCommentLines);
        }
        return { row: -1, column: -1 };
    }

    private getPosNeighbour(editor: ace.Editor, pos: ace.Position, directionUp: boolean, includeCommentLines: boolean): ace.Position {
        if (directionUp) {
            if (pos.row > 0) {
                const posNeighbour = { row: pos.row - 1, column: 0 };
                if (!includeCommentLines && this.isCommentLine(this.getLine(editor, posNeighbour))) {
                    return this.getPosNeighbour(editor, posNeighbour, directionUp, includeCommentLines);
                }
                return posNeighbour;
            } else {
                return { row: -1, column: -1 };
            }
        } else {
            if (editor.getSession().doc.getLength() > pos.row) {
                const posNeighbour = { row: pos.row + 1, column: 0 };
                if (!includeCommentLines && this.isCommentLine(this.getLine(editor, posNeighbour))) {
                    return this.getPosNeighbour(editor, posNeighbour, directionUp, includeCommentLines);
                }
                return posNeighbour;
            } else {
                return { row: -1, column: -1 };
            }
        }
    }

    private isCommentLine(line: string): boolean {
        return (line.replace(/\s/g, "").length === 0 || line.replace(/\s/g, "").startsWith("#"));
    }

}

export const manipulatorAce = new ConfigManipulatorAce();
