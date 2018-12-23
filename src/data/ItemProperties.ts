import _ from "lodash";
import YAML from 'yamljs';
import itemProperties_1_13 from '@/data/v1_13/itemProperties';
import { IItemProperty } from './ItemPropertyModel';

class ItemProperties {

    private itemProperties: IItemProperty[] = [];

    constructor() {
        this.loadItemProperties();
    }

    public loadItemProperties(version: string = "v1_13") {
        if (version === "v1_13") {
            this.itemProperties = YAML.parse(itemProperties_1_13);
        }
    }


    public values(): IItemProperty[] {
        return this.itemProperties;
    }

}

export const itemProperties = new ItemProperties();
