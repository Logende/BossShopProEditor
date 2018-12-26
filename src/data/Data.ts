
import _ from "lodash";
import YAML from 'yamljs';
import elementtypes_2_0 from '@/data/bsp_2_0/elementTypes.yml';
import itemproperties_2_0 from '@/data/bsp_2_0/itemProperties.yml';
import enums_2_0 from '@/data/bsp_2_0/enums.yml';

class Data {

    private dataElementTypes = elementtypes_2_0;
    private dataItemProperties = itemproperties_2_0;
    private dataEnums = enums_2_0;
    private updatedElementTypes: boolean = true;
    private updatedItemProperties: boolean = true;
    private updatedEnums: boolean = true;

    public update() {
        this.updatedElementTypes = true;
        this.updatedItemProperties = true;
        this.updatedEnums = true;
    }

    public wasUpdatedElementTypes(unset: boolean): boolean {
        const b = this.updatedElementTypes;
        if (unset) {
            this.updatedElementTypes = false;
        }
        return b;
    }

    public wasUpdatedItemProperties(unset: boolean): boolean {
        const b = this.updatedItemProperties;
        if (unset) {
            this.updatedItemProperties = false;
        }
        return b;
    }

    public wasUpdatedEnums(unset: boolean): boolean {
        const b = this.updatedEnums;
        if (unset) {
            this.updatedEnums = false;
        }
        return b;
    }

    public get elementTypesConfig(): any {
        return YAML.parse(this.dataElementTypes);
    }

    public get itemPropertiesConfig(): any {
        return YAML.parse(this.dataItemProperties);
    }

    public get enumsConfig(): any {
        return YAML.parse(this.dataEnums);
    }
}

export const data = new Data();
