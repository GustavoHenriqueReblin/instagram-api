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
    type: string,
    likes: Like[],
    comments: Comment[],
    views: number
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
    publicationId: number,
    username: string,
    name: string,
    photoURL: string
};

export type CommentReply = {
    id: number,
    userId: number,
    commentId: number,
    dateTime: Date,
    description: string,
    username: string,
    photoURL: string
};

export type CommentLike = {
    id: number,
    userId: number,
    commentReplyId: number,
    commentId: number,
    username: string,
    name: string,
    photoURL: string
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

export type View = {
    publicationId: number
    viewCount: number | null
};

export const defaultUserValues: User = {
    id: -1, 
    personId: -1,
    email: '',
    password: '',
    name: '',
    token: ''
};

export const defaultLikeValues: Like = {
    id: -1,
    userId: -1,
    publicationId: -1,
    name: '',
    photoURL: '',
    username: ''
}

export const defaultPublicationValues: Publication = {
    id: -1,
    categoryId: -1,
    category: '',
    comments: [{ id: -1, description: '', publicationId: -1, userId: -1, dateTime: new Date() }],
    description: '',
    fileId: -1,
    fileUrl: '',
    likes: [{ id: -1, publicationId: -1, userId: -1, name: '', photoURL: '', username: '' }],
    type: '',
    userId: -1,
    username: '',
    dateTime: new Date(),
    views: 0
};