import { Story } from '../types';
import { Conn } from '../db/Conn';

export const getStories = async (userId: number) => {
    const query = 
        'SELECT s.*, sv.`view`, f.url fileUrl, p.`name` username FROM story s ' +
        'INNER JOIN `file` f ON f.id = s.fileId ' +
        'INNER JOIN `user` u ON u.id = s.userId ' +
        'INNER JOIN `person` p ON p.id = u.personId ' +
        'LEFT JOIN story_view sv ON sv.storyId = s.id AND sv.userId = ? ' +
        'WHERE s.userId IN ( ' +
        '   SELECT f.`idUserFollowed` FROM `follow` f ' +
        '   WHERE f.`idUser` = ? ' +
        ') ';
    const [stories] = await Conn.execute(query, [userId, userId]);
    return stories as Story[];
};