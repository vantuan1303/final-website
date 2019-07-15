// const { BlogPost } = require('../model/BlogPost')
// const { Comment } = require('../model/Comment')
// const { getDetailBlogPost } = require('../controllers/blogPostControllers')
// const { verifyJWT } = require('./userControllers')

// const insertComment = async (content, blogPostId, tokenKey) => {
//     try {
//         let signedInUser = await verifyJWT(tokenKey)
//         let blogPostCommented = await getDetailBlogPost(blogPostId)
//         let newComment = await Comment.create({
//             content,
//             date: Date.now(),
//             author: signedInUser,
//             blogPost: blogPostCommented._id
//         })
//         await newComment.save()
//         await signedInUser.comments.push(newComment._id)
//         await signedInUser.save()
//         await blogPostCommented.comments.push(newComment._id)
//         await blogPostCommented.save()
//         return newComment
//     } catch (error) {
//         throw error
//     }
// }

// module.exports = {
//     insertComment
// }