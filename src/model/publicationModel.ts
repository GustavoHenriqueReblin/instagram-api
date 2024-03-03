import { Publication, Comment, Like } from '../types';
import { Conn } from '../db/Conn';

export const getPublications = async (userId: number) => {
    const query = 
        'SELECT p.* FROM `publication` p ' +
        'WHERE p.`userId` IN ( ' +
            'SELECT f.`idUserFollowed` FROM `follow` f ' +
            'WHERE f.`idUser` = ? ' +
        ') AND p.`dateTime` BETWEEN (CURDATE() - 2) AND NOW()';
    const [publications] = await Conn.execute(query, [userId]);
    return publications as Publication[];
};

export const getComments = async (publicationIds: number[]) => {
    const query = 'SELECT c.* FROM `comment` c WHERE c.publicationId IN (?)';
    const ids = publicationIds.join(',');
    const [comments] = await Conn.execute(query, [ids]);
    return comments as Comment[];
};

export const getLikes = async (publicationIds: number[]) => {
    const query = 'SELECT l.* FROM `like` l WHERE l.publicationId IN (?)';
    const ids = publicationIds.join(',');
    const [likes] = await Conn.execute(query, [ids]);
    return likes as Like[];
};