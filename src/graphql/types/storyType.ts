import gql from 'graphql-tag';

const storyType = gql`
    scalar DateTime

    type Story {
        id: ID!,
        userId: ID!,
        fileId: ID!,
        dateTime: DateTime,
        view: Int,
        fileUrl: String,
        username: String, 
    }

    input StoryInput {
        userId: ID
    }

    type StoryResponse {
        data: [Story]
        message: String
        error: String
    }

    type Query {
        stories(input: StoryInput!): StoryResponse!,
    }
`;

module.exports = storyType;