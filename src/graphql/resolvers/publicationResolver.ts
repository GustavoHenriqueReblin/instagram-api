import { getComments, getLikes, getPublications } from '../../model/publicationModel';

const publicationResolver = {
    Query: {
        publications: async (_: any, { input }: any) => {
            const { userId } = input;
            const pubs = await getPublications(userId);
            const Ids = pubs.map((pub) => {
                return pub.id;
            });
            const comments = await getComments(Ids);
            const likes = await getLikes(Ids);

            const publications = pubs.map((publication) => {
                const pubComments = comments.filter((comment) => comment.publicationId === publication.id);
                const pubLikes = likes.filter((like) => like.publicationId === publication.id);
            
                return {
                    ...publication,
                    comments: pubComments,
                    likes: pubLikes
                };
            });
            
            return {
                data: publications,
                message: '',
                error: '',
            }
        },
    },
  };
  
  module.exports = publicationResolver;