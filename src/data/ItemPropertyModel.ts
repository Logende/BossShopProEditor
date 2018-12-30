import { IElementType } from './ElementTypeModel';

export interface IItemProperty {
    name: string;
    key: string;
    content: IItemPropertyElement[];
    definition: string;
    infotext: string;
}

export interface IItemPropertyElement {
    displayname: string;
    type: IElementType;
    default: string;
    description: string;
}
