import _ from "lodash";
import { IItemProperty, IItemPropertyElement } from './ItemPropertyModel';
import { ElementTypeSimple, ElementTypeSimpleAutocomplete} from '@/data/ElementTypeModel';
import { enums } from './Enums';
import { data } from './Data';

class ItemProperties {

    private a: IItemProperty[] = [];

    public get values(): IItemProperty[] {
        if (!data.wasUpdatedItemProperties(true)) {
            return this.a;
        }
        console.log("generating new item properties.");
        const propertiesConfig = data.itemPropertiesConfig;

        this.a = [];
        for (const itemPropertyConfig of propertiesConfig) {
            this.a.push(this.loadItemProperty(itemPropertyConfig));
        }

        return this.a;
    }

    private loadItemProperty(itemPropertyConfig: any): IItemProperty {
        const name = _.at(itemPropertyConfig, ["name"])[0] as string;
        const key = _.at(itemPropertyConfig, ["key"])[0] as string;
        const definition = _.at(itemPropertyConfig, ["definition"])[0] as string;
        const infotext = _.at(itemPropertyConfig, ["infotext"])[0] as string;
        const contentConfig = _.at(itemPropertyConfig, ["content"])[0] as any;
        const content: IItemPropertyElement[] = [];
        for (const itemPropertyElementConfig of contentConfig) {
            const itemPropertyElement = this.loadItemPropertyElement(itemPropertyElementConfig as any);
            content.push(itemPropertyElement);
        }
        return {
            name,
            key,
            definition,
            infotext,
            content
        };
    }

    private loadItemPropertyElement(itemPropertyElementConfig: any): IItemPropertyElement {
        const displayname = _.at(itemPropertyElementConfig, ["displayname"])[0] as string;
        const type = _.at(itemPropertyElementConfig, ["type"])[0] as string;
        const defaultValue = _.at(itemPropertyElementConfig, ["default"])[0] as string;
        const description = _.at(itemPropertyElementConfig, ["description"])[0] as string;

        if (type.startsWith("simple:")) {
            const simpleType = type.split(":")[1];
            const elementType = new ElementTypeSimple(simpleType, description);
            return {
                displayname,
                type: elementType,
                default: defaultValue,
                description
            };

        } else if (type.startsWith("simple_autocomplete:")) {
            const simpleType = type.split(":")[1];
            const autocomplete = _.at(itemPropertyElementConfig, ["autocomplete"])[0] as string;
            const possibilities = enums.get(autocomplete);
            const elementType = new ElementTypeSimpleAutocomplete(simpleType, description, possibilities);
            return {
                displayname,
                type: elementType,
                default: defaultValue,
                description
            };
        }
        throw Error("Unknown ElementType type: ' " + type + "' for item property.");
    }


}

export const itemProperties = new ItemProperties();
