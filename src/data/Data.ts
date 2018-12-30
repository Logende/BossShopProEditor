
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

    private etItemshop: boolean = false;
    private etItemshopAdv: boolean = false;
    private etShopAdvShop: boolean = false;
    private etShopAdvShopItem: boolean = false;
    private etConditions: boolean = true;
    private etClickTypes: boolean = false;
    private etPlayerInput: boolean = false;
    private etSoundsShop: boolean = false;
    private etSoundsShopItem: boolean = false;

    private dataEtShop = etShop_2_0;
    private dataEtShopItem = etShopitem_2_0;
    private dataEtShopConditions = etShopConditions_2_0;
    private dataEtShopPlayerInput = etShopPlayerInput_2_0;
    private dataEtShopClickTypes = etShopClickTypes_2_0;
    private dataEtShopAdvShopItem = etShopAdvShopItem_2_0;
    private dataEtShopSoundsShopItem = etShopSoundsShopItem_2_0;
    private dataEtShopAdvShop = etShopAdvShop_2_0;
    private dataEtShopSoundsShop = etShopSoundsShop_2_0;
    private dataEtItemShop = etItemShop_2_0;
    private dataEtItemShopAdv = etItemShopAdv_2_0;

    private dataItemProperties = itemproperties_2_0;
    private dataEnBsp = e_2_0_bsp;
    private dataEnMc = e_2_0_mc;

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
        }
        if (this.etItemshopAdv) {
            configParts.push(this.dataEtItemShopAdv);
        }

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
