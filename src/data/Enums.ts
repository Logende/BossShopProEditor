
import _ from "lodash";
import { data } from './Data';

class Enums {

    private m: Map<string, string[]> = new Map<string, string[]>();

    public get map(): Map<string, string[]> {
        if (!data.wasUpdatedEnums(true)) {
            return this.m;
        }
        console.log("generating new enums.");
        const config = data.enumsConfig;

        this.m.clear();
        for (const key of Object.keys(config)) {
            const enumConfig = _.at(config, [key])[0] as string[];
            this.m.set(key, enumConfig);
        }

        return this.m;
    }

    public get(key: string): string[] {
        return this.map.get(key)!;
    }
}

export const enums = new Enums();
