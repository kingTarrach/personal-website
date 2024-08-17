
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', articleSchema);

module.exports = BlogPost;
