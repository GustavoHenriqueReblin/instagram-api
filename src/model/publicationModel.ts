import { Publication, Comment, Like, CommentReply, defaultLikeValues } from '../types';
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
    const paramsIds = publicationIds.map((id) => {return id}).join(',');
    const query = 
        'SELECT c.*, u.`username`, u.`photoURL` FROM `comment` c ' +
        'INNER JOIN `user` u ON u.id = c.userId ' +
        `WHERE c.publicationId IN ( ${paramsIds || 0} )`;
    const [comments] = await Conn.execute(query);
    return comments as Comment[];
};

export const getCommentsReply = async (commentIds: number[]) => {
    const paramsIds = commentIds.map((id) => {return id}).join(',');
    console.log(paramsIds);
    const query = 
        'SELECT cr.*, u.`username`, u.`photoURL` FROM comment_reply cr ' +
        'INNER JOIN `user` u ON u.id = cr.userId ' +
        `WHERE cr.commentId IN ( ${paramsIds || 0} )`;
    const [commentsReply] = await Conn.execute(query);
    return commentsReply as CommentReply[];
};

export const getLikes = async (publicationIds: number[]) => {
    const paramsIds = publicationIds.map((id) => {return id}).join(',');
    console.log(paramsIds);
    
    const query = 
        'SELECT l.*, LOWER(u.`username`) username, p.`name`, u.photoURL FROM `like` l ' +
        'INNER JOIN `user` u ON u.id = l.userId ' +
        'INNER JOIN `person` p ON p.id = u.personId ' +
        `WHERE l.publicationId IN ( ${paramsIds || 0} )`;
    const [likes] = await Conn.execute(query);
    return likes as Like[];
};

export const getLike = async (likeId: number[]) => {
    const query = 
        'SELECT l.*, LOWER(u.`username`) username, p.`name`, u.photoURL FROM `like` l ' +
        'INNER JOIN `user` u ON u.id = l.userId ' +
        'INNER JOIN `person` p ON p.id = u.personId ' +
        'WHERE l.id = ?';
    const [like] = await Conn.execute(query, [likeId]);
    return like as Like[];
};

export const updateUserView = async (userId: number, publicationIds: number[]) => {
    const conn = await Conn.getConnection();
    try {
        await conn.beginTransaction();
        for (let i = 0; i < publicationIds.length; i++) {
            const query = `
                INSERT INTO \`publication_view\` (publicationId, userId, view) 
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE publicationId= VALUES(publicationId), userId= VALUES(userId), view = 1
            `;
            await conn.execute(query, [publicationIds[i], userId]);
        }
        await conn.commit();
    } catch (error) {
        await conn.rollback();
        console.error('Erro ao atualizar publication_view: ', error);
    } finally {
        conn.release();
    }
};

export const addPublicationLike = async (like: Like) => {
    let insertId;
    const conn = await Conn.getConnection();
    try {
        await conn.beginTransaction();
        const query = `
            INSERT INTO \`like\` (userId, publicationId) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE userId = VALUES(userId), publicationId = VALUES(publicationId)
        `;
        [{ insertId }] = await conn.execute(query, [like.userId, like.publicationId]);
        await conn.commit();
    } catch (error) {
        await conn.rollback();
        console.error('Erro ao inserir `likes`: ', error);
    } finally {
        conn.release();
        return insertId;
    }
};

export const deletePublicationLike = async (likeId: number) => {
    let affectedRows;
    const conn = await Conn.getConnection();
    try {
        await conn.beginTransaction();
        const query = 'DELETE FROM `like` WHERE id = ?';
        affectedRows = await conn.execute(query, [likeId]);
        await conn.commit();
    } catch (error) {
        await conn.rollback();
        console.error('Erro ao deletar `likes`: ', error);
    } finally {
        conn.release();
        return affectedRows;
    }
};