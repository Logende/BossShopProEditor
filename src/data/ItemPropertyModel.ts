export interface IItemProperty {
    name: string;
    key: string;
    content: IItemPropertyElement[];
}

export interface IItemPropertyElement {
    displayname: string;
    type: string;
    default: string;
}
