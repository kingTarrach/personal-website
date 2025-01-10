const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');
const Comment = require('../models/comments');

// Route to add an article
app.post('/admin/add-article', async (req, res) => {
  if (!req.session.isAuthenticated) {
    req.flash('error_msg', 'Unauthorized access');
    return res.redirect('/admin/login');
  }

  const { title, content } = req.body;

  try {
    const newArticle = new BlogPost({ title, content });
    await newArticle.save();  // Save article to MongoDB
    req.flash('success_msg', 'Article added successfully');
    res.redirect('/articles');  // Redirect to articles list
  } catch (error) {
    console.error('Error adding article:', error);
    req.flash('error_msg', 'Failed to add article');
    res.redirect('/admin/add-article');
  }
});

// Get a BlogPost and its Comments
router.get('/articles/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).send('Blog post not found');
    }
    const comments = await Comment.find({ article: postId });
    const articles = await BlogPost.find().sort({ date: -1 }); // Fetch latest articles and sort by date
    res.render('blog_post', { post, comments, articles });
  } catch (err) {
    console.error('Error fetching blog post and comments:', err);
    res.status(500).send('Server error');
  }
});

// Add a Comment to a BlogPost
router.post('/articles/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { commenterName, commentText } = req.body;

    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).send('Blog post not found');
    }

    const newComment = new Comment({
      article: postId,
      name: commenterName,
      comment: commentText
    });

    await newComment.save();
    res.redirect(`/articles/${postId}`);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Server error');
  }
});

// Route to delete a single comment by ID
router.delete('/comments/:id', async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).send('Comment deleted successfully.');
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).send('Server error.');
  }
});

// Route to delete all comments
router.delete('/comments', async (req, res) => {
  try {
    await Comment.deleteMany({});
    res.status(200).send('All comments deleted successfully.');
  } catch (err) {
    console.error('Error deleting comments:', err);
    res.status(500).send('Server error.');
  }
});

module.exports = router;
