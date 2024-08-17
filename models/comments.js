
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true
  },
  name: { type: String, required: true },
  comment: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  replies: [this]
});

commentSchema.add({ replies: [commentSchema] });
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
