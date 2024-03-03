import { getStories } from '../../model/storyModel';

const storyResolver = {
    Query: {
        stories: async (_: any, { input }: any) => {
            const { userId } = input;
            const stories = await getStories(userId);
            
            return {
                data: stories,
                message: '',
                error: '',
            }
        },
    },
  };
  
  module.exports = storyResolver;