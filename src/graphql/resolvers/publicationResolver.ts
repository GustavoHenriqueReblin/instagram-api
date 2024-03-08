import { 
    addPublicationLike, deletePublicationLike, getComments, getCommentsReply, getLike, getLikes, 
    getPublications, getViews, updateUserView 
} from '../../model/publicationModel';
import { defaultLikeValues } from '../../types';

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
            const views = await getViews(IdsPublication);
            
            const publications = pubs.map((publication) => {
                const pubComments = comments.filter((comment) => comment.publicationId === publication.id);
                const pubLikes = likes.filter((like) => like.publicationId === publication.id);
                const pubViews = views.filter((view) => view.publicationId === publication.id);

                const commentsAndReplies = pubComments.map((pubComment) => {
                    const thisCommentsReply = commentsReply.filter((commentReply) => commentReply.commentId === pubComment.id);
                    return {
                        ...pubComment,
                        commentsReply: thisCommentsReply
                    };
                });
            
                return {
                    ...publication,
                    views: pubViews.length > 0 ? pubViews[0].viewCount : 0,
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

    Mutation: {
        addPublicationLike: async (_: any, { input }: any, __: any) => {
            const insertedId = await addPublicationLike(input);
            const like = await getLike(insertedId);
            return like ? like[0] : defaultLikeValues;
        },
        deletePublicationLike: async (_: any, { input }: any, __: any) => {
            const { id } = input;
            const affectedRows = await deletePublicationLike(id);
            const message = affectedRows ? 'Like removido com sucesso!' : 'Like não encontrado!';
            return message;
        },
    }
  };
  
  module.exports = publicationResolver;