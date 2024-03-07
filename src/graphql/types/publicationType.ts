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
    }

    input PublicationInput {
        userId: ID
        categoryId: ID
    }

    type PublicationResponse {
        data: [Publication]
        message: String
        error: String
    }

    type Query {
        publications(input: PublicationInput!): PublicationResponse!,
    }
`;

module.exports = publicationType;