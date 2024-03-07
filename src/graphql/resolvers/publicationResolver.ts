import { 
    getComments, getCommentsReply, getLikes, getPublications, updateUserView 
} from '../../model/publicationModel';

const publicationResolver = {
    Query: {
        publications: async (_: any, { input }: any) => {
            const { userId } = input;
            const pubs = await getPublications(userId);
            const IdsPublication = pubs.map((pub) => {
                return pub.id;
            });
            const comments = await getComments(IdsPublication);
            const IdsComments = comments.map((comment) => {
                return comment.id;
            }); 
            const commentsReply = await getCommentsReply(IdsComments);
            const likes = await getLikes(IdsPublication);

            const publications = pubs.map((publication) => {
                const pubComments = comments.filter((comment) => comment.publicationId === publication.id);
                const pubLikes = likes.filter((like) => like.publicationId === publication.id);

                const commentsAndReplies = pubComments.map((pubComment) => {
                    const thisCommentsReply = commentsReply.filter((commentReply) => commentReply.commentId === pubComment.id);
                    return {
                        ...pubComment,
                        commentsReply: thisCommentsReply
                    };
                });
            
                return {
                    ...publication,
                    comments: commentsAndReplies,
                    likes: pubLikes
                };
            });

            const env = process.env.ENVIRONMENT;
            env && env !== 'dev' && updateUserView(userId, IdsPublication)
                .then(() => {console.log("Visualização das publicações atualizadas com sucesso!")});
            
            return {
                data: publications,
                message: '',
                error: '',
            }
        },
    },
  };
  
  module.exports = publicationResolver;