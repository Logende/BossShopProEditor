
import _ from "lodash";
import YAML from 'yamljs';
import etItemShopAdv_2_0 from '@/data/bsp_2_0/elementTypes_itemshop_advanced.yml';
import etItemShop_2_0 from '@/data/bsp_2_0/elementTypes_itemshop.yml';
import etShopAdvShop_2_0 from '@/data/bsp_2_0/elementTypes_shop_advanced_shop.yml';
import etShopAdvShopItem_2_0 from '@/data/bsp_2_0/elementTypes_shop_advanced_shopitem.yml';
import etShopConditions_2_0 from '@/data/bsp_2_0/elementTypes_shop_conditions.yml';
import etShopClickTypes_2_0 from '@/data/bsp_2_0/elementTypes_shop_different_clicktypes.yml';
import etShopPlayerInput_2_0 from '@/data/bsp_2_0/elementTypes_shop_playerinput.yml';
import etShopSoundsShop_2_0 from '@/data/bsp_2_0/elementTypes_shop_sounds_shop.yml';
import etShopSoundsShopItem_2_0 from '@/data/bsp_2_0/elementTypes_shop_sounds_shopitem.yml';
import etShop_2_0 from '@/data/bsp_2_0/elementTypes_shop.yml';
import etShopitem_2_0 from '@/data/bsp_2_0/elementTypes_shopitem.yml';
import itemproperties_2_0 from '@/data/bsp_2_0/itemProperties.yml';
import e_2_0_bsp from '@/data/bsp_2_0/enums_bsp.yml';
import e_2_0_mc from '@/data/bsp_2_0/enums_mc.yml';

class Data {

    public etItemshop: boolean = true;
    public etItemshopAdv: boolean = true;
    public etShopAdvShop: boolean = true;
    public etShopAdvShopItem: boolean = true;
    public etConditions: boolean = true;
    public etClickTypes: boolean = true;
    public etPlayerInput: boolean = true;
    public etSoundsShop: boolean = true;
    public etSoundsShopItem: boolean = true;

    public dataEtShop = etShop_2_0;
    public dataEtShopItem = etShopitem_2_0;
    public dataEtShopConditions = etShopConditions_2_0;
    public dataEtShopPlayerInput = etShopPlayerInput_2_0;
    public dataEtShopClickTypes = etShopClickTypes_2_0;
    public dataEtShopAdvShopItem = etShopAdvShopItem_2_0;
    public dataEtShopSoundsShopItem = etShopSoundsShopItem_2_0;
    public dataEtShopAdvShop = etShopAdvShop_2_0;
    public dataEtShopSoundsShop = etShopSoundsShop_2_0;
    public dataEtItemShop = etItemShop_2_0;
    public dataEtItemShopAdv = etItemShopAdv_2_0;

    public dataItemProperties = itemproperties_2_0;
    public dataEnBsp = e_2_0_bsp;
    public dataEnMc = e_2_0_mc;

    public updatedElementTypes: boolean = true;
    public updatedItemProperties: boolean = true;
    public updatedEnums: boolean = true;

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
        const configParts: string[] = [];
        configParts.push(this.dataEtShop);
        configParts.push(this.dataEtShopItem);
        if (this.etConditions) {
            configParts.push(this.dataEtShopConditions);
        }
        if (this.etPlayerInput) {
            configParts.push(this.dataEtShopPlayerInput);
        }
        if (this.etClickTypes) {
            configParts.push(this.dataEtShopClickTypes);
        }
        if (this.etShopAdvShopItem) {
            configParts.push(this.dataEtShopAdvShopItem);
        }
        if (this.etSoundsShopItem) {
            configParts.push(this.dataEtShopSoundsShopItem);
        }
        if (this.etShopAdvShop) {
            configParts.push(this.dataEtShopAdvShop);
        }
        if (this.etSoundsShop) {
            configParts.push(this.dataEtShopSoundsShop);
        }
        if (this.etItemshop) {
            configParts.push(this.dataEtItemShop);
            if (this.etItemshopAdv) {
                configParts.push(this.dataEtItemShopAdv);
            }
        }
        console.log("generating elementTypes with itemshop " + this.etItemshop);

        return YAML.parse(configParts.join("\r\n"));
    }

    public get itemPropertiesConfig(): any {
        return YAML.parse(this.dataItemProperties);
    }

    public get enumsConfig(): any {
        const configParts: string[] = [this.dataEnBsp, this.dataEnMc];
        return YAML.parse(configParts.join("\r\n"));
    }
}

export const data = new Data();
