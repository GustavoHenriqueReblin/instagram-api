import gql from 'graphql-tag';

const userType = gql`
    type User {
        id: ID!
        personId: ID!
        username: String
        email: String!
        password: String!
        token: String
        name: String!
    }

    input UserInput {
        id: ID
        personId: ID
        username: String
        email: String
        password: String
        token: String
        name: String
    }

    type UserResponse {
        data: [User]
        message: String
        error: String
    }

    type Query {
        user(input: UserInput!): UserResponse!,
        getUserByToken(input: UserInput!): UserResponse!
        getFollowSuggestions(input: UserInput!): UserResponse!
    }

    type Mutation {
        # createUser(input: UserInput!): UserResponse!
        updateUser(input: UserInput!): UserResponse
    }
`;

module.exports = userType;