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
    description: string,
    fileUrl: string,
    username: string, 
    category: string,
    type: string
};

export type Comment = {
    id: number,
    userId: number,
    publicationId: number,
    dateTime: Date,
    description: string
};

export type CommentReply = {
    id: number,
    userId: number,
    commentId: number,
    dateTime: Date,
    description: string
};

export type Like = {
    id: number,
    userId: number,
    publicationId: number
};

export type Story = {
    id: number,
    userId: number,
    fileId: number,
    dateTime: Date,
    view: number,
    fileUrl: string,
    username: string, 
};