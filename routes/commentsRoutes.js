const router = require("express").Router();
const commentsService = require("../services/commentsService");
// middlewares
const { checkBodyData, checkToken } = require("./middlewares")

// ===== create =====
router.post('/create', checkToken, checkBodyData, async (req, res) => {
    const commentData = {
        ...req.body,
        ...req.user
    }
    const { created, message, id } = await commentsService.createComment(commentData);
    return res.json({
        ok: created,
        message,
        data: { id }
    })
})

router.post('/reply', checkToken, checkBodyData, async (req, res) => {
    const { parentCommentId } = req.body;
    const replyData = {
        ...req.user,
        ...req.body
    }
    const { created, message } = await commentsService.createReply(parentCommentId, replyData);
    return res.json({
        ok: created,
        message,
        data: {
            parentCommentId
        }
    });
});

// ===== update =====
router.put('/update-comment', checkToken, checkBodyData, async (req, res ) => {
    const { newText, commentId } = req.body;
    const { username } = req.user;
    const { updated, message } = await commentsService.updateComment(
        commentId, 
        newText, 
        username
    );
    return res.json({ ok: updated, message, data: {} })
})

router.put('/update-reply', checkToken, checkBodyData, async (req, res ) => {
    const { parentCommentId, index, newText } = req.body;
    const { username } = req.user;
    const { updated, message } = await commentsService.updateReply({
        parentCommentId,
        newText,
        index,
        username
    });
    return res.json({ ok: updated, message, data: { parentCommentId } })
})

// ===== get comments =====
router.get('/', async (req, res) => {
    const { movieId, skip, limit } = req.query; 
    const { comments, message } = await commentsService.getMoviesComments(movieId, skip, limit);
    return res.json({
        ok: !!comments,
        message,
        data: { comments }
    });
});

// ===== delete =====
router.delete('/delete-comment', checkToken, checkBodyData, async (req, res) => {
    const { commentId } = req.query;
    const { deleted, message } = await commentsService.deleteComment(commentId);
    return res.json({ ok: deleted, message, data: {} });
});

router.delete('/delete-reply', checkToken, checkBodyData, async (req, res) => {
    const { parentCommentId, index } = req.query;
    const { deleted, message } = await commentsService.deleteReply(parentCommentId, index);
    return res.json({ ok: deleted, message, data: {} });
});

module.exports = router;