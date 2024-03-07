import { Publication, Comment, Like, CommentReply } from '../types';
import { Conn } from '../db/Conn';

export const getPublications = async (userId: number) => {
    const query = 
        'SELECT p.*, f.`url` AS fileUrl, u.`username`, c.`name` category, t.`name` AS `type` ' +
        'FROM `publication` p ' +
        'INNER JOIN `file` f ON f.id = p.fileId ' +
        'INNER JOIN `type` t ON t.id = f.typeId ' + 
        'INNER JOIN `user` u ON u.id = p.userId ' +
        'INNER JOIN `person` pe ON pe.id = u.personId ' +
        'INNER JOIN `category` c ON c.id = p.categoryId ' +
        'LEFT JOIN `publication_view` pv ON pv.publicationId = p.id AND pv.userId = ? ' +
        'WHERE p.`userId` IN ( ' +
            'SELECT f.`idUserFollowed` FROM `follow` f ' +
            'WHERE f.`idUser` = ? ' +
        ') AND p.`dateTime` BETWEEN (CURDATE() - 2) AND NOW() AND pv.`view` IS NULL LIMIT 5';
    const [publications] = await Conn.execute(query, [userId, userId]);
    return publications as Publication[];
};

export const getComments = async (publicationIds: number[]) => {
    const query = 
        'SELECT c.*, u.`username`, u.`photoURL` FROM `comment` c ' +
        'INNER JOIN `user` u ON u.id = c.userId ' +
        'WHERE c.publicationId IN (?)';
    const ids = publicationIds.join(',');
    const [comments] = await Conn.execute(query, [ids]);
    return comments as Comment[];
};

export const getCommentsReply = async (commentIds: number[]) => {
    const query = 
        'SELECT cr.*, u.`username`, u.`photoURL` FROM comment_reply cr ' +
        'INNER JOIN `user` u ON u.id = cr.userId ' +
        'WHERE cr.commentId IN (?)';
    const ids = commentIds.join(',');
    const [commentsReply] = await Conn.execute(query, [ids]);
    return commentsReply as CommentReply[];
};

export const getLikes = async (publicationIds: number[]) => {
    const query = 
        'SELECT l.*, LOWER(u.`username`) username, p.`name`, u.photoURL FROM `like` l ' +
        'INNER JOIN `user` u ON u.id = l.userId ' +
        'INNER JOIN `person` p ON p.id = u.personId ' +
        'WHERE l.publicationId IN (?)';
    const ids = publicationIds.join(',');
    const [likes] = await Conn.execute(query, [ids]);
    return likes as Like[];
};

export const updateUserView = async (userId: number, publicationIds: number[]) => {
    let query;
    for (let i = 0; i <= publicationIds.length - 1; i++) {
        query = 
            'INSERT INTO publication_view (publicationId, userId, view) ' +
            `VALUES(${publicationIds[i]}, ${userId}, 1) ` + 
            `ON DUPLICATE KEY UPDATE publicationId=${publicationIds[i]}, userId=${userId}, view = 1`;
        await Conn.execute(query);
    }
};