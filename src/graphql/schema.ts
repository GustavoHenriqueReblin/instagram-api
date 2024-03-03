const userResolver = require('./resolvers/userResolver');
const userTypeSchema = require('./types/userType');
const publicationResolver = require('./resolvers/publicationResolver');
const publicationTypeSchema = require('./types/publicationType');

const schema = {
    typeDefs: [
        userTypeSchema, publicationTypeSchema
    ],
    resolvers: [
        userResolver, publicationResolver
    ],
};

module.exports = schema;