export type User = {
    id: number,
    personId: number,
    name: string,
    email: string,
    password: string,
    token: string
};

export type Publication = {
    id: number,
    categoryId: number,
    fileId: number,
    userId: number,
    dateTime: Date,
    description: string
};

export type Comment = {
    id: number,
    userId: number,
    publicationId: number,
    dateTime: Date,
    description: string
};

export type Like = {
    id: number,
    userId: number,
    publicationId: number
};