import { pathToString } from "@/pathHelper";

class ConfigManipulator {



    public readCommentLines(configText: string): Map<string, string[]> {
        const commentLines = new Map<string, string[]>();

        let entry: {indexLine: number, line: string|undefined} = {indexLine: 0, line: this.getLine(configText, 0)};
        let currentKey = "$firstLine";
        let currentCommentLines: string[] = [];
        while (entry.indexLine > -1) {

            if (this.isCommentLine(entry.line!)) {
                // Is comment line -> store comment
                currentCommentLines.push(entry.line!);
            } else {
                // Is config line -> push comment array and start with new comment array
                commentLines.set(currentKey, currentCommentLines);
                const path = this.getPath(configText, entry.indexLine);
                currentKey = pathToString(path)!;
                currentCommentLines = [];
            }

            entry = this.getEntryNeighbour(configText, entry.indexLine, false, true);
        }
        commentLines.set(currentKey, currentCommentLines);
        return commentLines;
    }

    /**
     * Adds the previously stored comments to the config text. Assumes there are no comments existing yet.
     * @param configText Config text.
     * @param commentLines Comments to add.
     */
    public writeCommentLines(configText: string, commentLines: Map<string, string[]>): string {
        let firstIndexLine = 0;
        // add comments above first path
        let comments = commentLines.get("$firstLine")!;
        if (comments.length > 0) {
            const commentsString = comments.join("\n");
            configText = commentsString + "\n" + configText;
            firstIndexLine = commentsString.length;
        }

        // add comments below path
        let entry: {indexLine: number, line: string|undefined} = {indexLine: firstIndexLine, line: this.getLine(configText, 0)};
        while (entry.indexLine > -1) {

            const path = this.getPath(configText, entry.indexLine);
            const currentKey = pathToString(path)!;

            if (commentLines.has(currentKey)) {
                comments = commentLines.get(currentKey)!;
                if (comments.length > 0) {
                    // Currently having a line selected which have comments to be added below the line -> find end of line and add comments there
                    let endPosition = configText.indexOf("\n", entry.indexLine);
                    if (endPosition === - 1) {
                        endPosition = configText.length;
                    }
                    const commentsString = comments.join("\n");
                    entry.indexLine += commentsString.length;
                    configText = configText.substring(0, endPosition) + "\n" + commentsString + configText.substring(endPosition);
                }
            }

            entry = this.getEntryNeighbour(configText, entry.indexLine, false, true);
        }

        return configText;
    }


    public getPath(configText: string, indexLine: number, arrayIndex: number = -1): Array<string|number> {
        if (indexLine === undefined) {
            throw new Error("Unable to get path: indexLine undefined.");
        }

        const line = this.getLine(configText, indexLine);
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
            const entryAbove = this.getEntryNeighbour(configText, indexLine, true, false);
            return this.getPath(configText, entryAbove.indexLine, arrayIndex + 1);
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
            if (arrayIndex > -1) {
                path.push(arrayIndex);
            }
            return path;
        }
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
    private getEntryParent(configText: string, indexLine: number): {indexLine: number, line: string|undefined} {
        const line = this.getLine(configText, indexLine);
        const levelLine = this.getLevel(line);
        const levelParentLine = levelLine - 1;
        if (levelParentLine < 0) { // invalid parent line level
            return {indexLine: - 1, line: undefined};
        }
        const specificCheck: (indexLine: number, line: string|null) => boolean = (indexNeighbourLine, lineNeighbour) => {
            const levelNeighbourLine = this.getLevel(lineNeighbour!);
            return levelNeighbourLine === levelParentLine;
        };
        return this.getEntryNeighbourSpecific(configText, indexLine, true, false, specificCheck);
    }

    private getEntryNeighbourSpecific(configText: string, indexLine: number, directionUp: boolean, includeCommentLines: boolean, specificCheck: (indexLine: number, line: string) => boolean): {indexLine: number, line: string|undefined} {
        let entryNeighbour = this.getEntryNeighbour(configText, indexLine, directionUp, includeCommentLines);
        while (entryNeighbour.indexLine !== - 1) {
            if (specificCheck(entryNeighbour.indexLine, entryNeighbour.line!)) {
                return entryNeighbour;
            }
            entryNeighbour = this.getEntryNeighbour(configText, entryNeighbour.indexLine, directionUp, includeCommentLines);
        }
        return {indexLine: -1, line: undefined};
    }

    private getEntryNeighbour(configText: string, indexLine: number, directionUp: boolean, includeCommentLines: boolean): {indexLine: number, line: string|undefined} {
        if (directionUp) {
            const indexLineNeighbour = configText.substring(0, indexLine).lastIndexOf("\n") - 1;
            if (indexLineNeighbour !== - 1 - 1) {
                const lineNeighbour = this.getLine(configText, indexLineNeighbour);
                if (!includeCommentLines && this.isCommentLine(lineNeighbour)) {
                    return this.getEntryNeighbour(configText, indexLineNeighbour, directionUp, includeCommentLines);
                }
                return {indexLine: indexLineNeighbour, line: lineNeighbour};
            }
        } else {
            const indexLineNeighbour = configText.substring(indexLine).indexOf("\n") + indexLine + 1;
            if (indexLineNeighbour !== - 1 + indexLine + 1) {
                const lineNeighbour = this.getLine(configText, indexLineNeighbour);
                if (!includeCommentLines && this.isCommentLine(lineNeighbour)) {
                    return this.getEntryNeighbour(configText, indexLineNeighbour, directionUp, includeCommentLines);
                }
                return {indexLine: indexLineNeighbour, line: lineNeighbour};
            }
        }
        return {indexLine: -1, line: undefined};
    }

    private isCommentLine(line: string): boolean {
        return (line.replace(/\s/g, "").length === 0 || line.replace(/\s/g, "").startsWith("#"));
    }

}

export const manipulator = new ConfigManipulator();
