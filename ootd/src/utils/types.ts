// specific Clothes Item
export type clothesItem = {
  type: string;
  photoLink: string;
  fileRef: string;
};

// holds all clothes items of a certain type
export type clothesType = {
  type: string;
  clothesItems: clothesItem[];
};
