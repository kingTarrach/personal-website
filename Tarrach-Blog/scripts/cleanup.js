
const mongoose = require('mongoose');
const BlogPost = require('../models/blogPost'); // Adjust the path if necessary

async function cleanup() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Delete all duplicate articles
    await BlogPost.deleteMany({ title: "My First Blog" });
    console.log('Duplicate articles deleted successfully');

    mongoose.connection.close();
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}

cleanup();
