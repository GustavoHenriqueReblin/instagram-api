import gql from 'graphql-tag';

const publicationType = gql`
    scalar DateTime

    type Like {
        id: ID!
        userId: ID!
        publicationId: ID!
        username: String!
        name: String!
        photoURL: String!
    }

    type Comment {
        id: ID!
        userId: ID!
        publicationId: ID!
        dateTime: DateTime!
        description: String!
        username: String!
        photoURL: String!
        commentsReply: [CommentReply!]
    }

    type CommentReply {
        id: ID!
        userId: ID!
        commentId: ID!
        dateTime: DateTime!
        description: String!
        username: String!
        photoURL: String!
    }

    type Publication {
        id: ID!
        categoryId: ID!
        fileId: ID!
        userId: ID!
        dateTime: DateTime!
        description: String!
        comments: [Comment!]
        likes: [Like!]
        fileUrl: String!
        username: String!
        category: String!
        type: String!
        views: Int
    }

    input PublicationInput {
        userId: ID
        categoryId: ID
    }

    input LikeInput {
        id: ID!
        userId: ID
        publicationId: ID
    }

    type PublicationResponse {
        data: [Publication]
        message: String
        error: String
    }

    type Query {
        publications(input: PublicationInput!): PublicationResponse!,
    }

    type Mutation {
        addPublicationLike(input: LikeInput!): Like,
        deletePublicationLike(input: LikeInput!): String,
    }
`;

module.exports = publicationType;