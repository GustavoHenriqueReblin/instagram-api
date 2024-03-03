const userResolver = require('./resolvers/userResolver');
const userTypeSchema = require('./types/userType');
const publicationResolver = require('./resolvers/publicationResolver');
const publicationTypeSchema = require('./types/publicationType');
const storyResolver = require('./resolvers/storyResolver');
const storyTypeSchema = require('./types/storyType');

const schema = {
    typeDefs: [
        userTypeSchema, publicationTypeSchema, storyTypeSchema
    ],
    resolvers: [
        userResolver, publicationResolver, storyResolver
    ],
};

module.exports = schema;