import _ from "lodash";
import YAML from 'yamljs';
import itemProperties_1_13 from '@/data/bsp_2_0/itemProperties.yml';
import { IItemProperty } from './ItemPropertyModel';

class ItemProperties {

    private itemProperties: IItemProperty[] = [];

    constructor() {
        this.loadItemProperties();
    }

    public loadItemProperties(bspVersion: string = "2_0") {
        if (bspVersion === "2_0") {
            this.itemProperties = YAML.parse(itemProperties_1_13);
        }
    }


    public get values(): IItemProperty[] {
        return this.itemProperties;
    }

}

export const itemProperties = new ItemProperties();
