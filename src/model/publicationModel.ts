import { Publication, Comment, Like } from '../types';
import { Conn } from '../db/Conn';

export const getPublications = async (userId: number) => {
    const query = 
        'SELECT p.*, f.`url` AS fileUrl, pe.`name` username, c.`name` category ' +
        'FROM `publication` p ' +
        'INNER JOIN `file` f ON f.id = p.fileId ' +
        'INNER JOIN `user` u ON u.id = p.userId ' +
        'INNER JOIN `person` pe ON pe.id = u.personId ' +
        'INNER JOIN `category` c ON c.id = p.categoryId ' +
        'LEFT JOIN `publication_view` pv ON pv.publicationId = p.id AND pv.userId = ? ' +
        'WHERE p.`userId` IN ( ' +
            'SELECT f.`idUserFollowed` FROM `follow` f ' +
            'WHERE f.`idUser` = ? ' +
        ') AND p.`dateTime` BETWEEN (CURDATE() - 2) AND NOW() AND pv.`view` IS NULL';
    const [publications] = await Conn.execute(query, [userId, userId]);
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