
// specific Clotthes Item 
export type clothesItem = {
    type: string;
    photoLink: string;
}

// holds all clothes items of a certain type
export type clothesType = {
    type: string;
    clothesItems: clothesItem[];
}