const BlogPost = require('/root/Other/Tarrach-Blog/models/blogPost');
const mongoose = require('mongoose');


// Sample articles and comments data
const newBlogPost = new BlogPost ({
    title: "",
    content: "",
    date: "2024-07-12"
  });


async function setup() {

    try {
      mongoose.connect('mongodb://localhost:27017/mydatabase')
      .then(() => console.log('MongoDB connected successfully'))
      .catch(err => console.error('MongoDB connection error:', err)); 
  
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.on('disconnected', function() {
        console.log('Mongoose disconnected');
      });
  
      db.on('reconnected', function () {
        console.log('Mongoose reconnected');
      });
  
      db.on('close', function () {
        console.log('Mongoose connection closed');
      });
      db.once('open', function() {
        console.log("mongodb running.")
      })
  
      const existingArticle = await BlogPost.findOne({ title: newBlogPost.title });
      if (!existingArticle) {
        const newPost = new BlogPost(newBlogPost);
        await newPost.save();
        console.log('Sample article created successfully');
      } else {
        console.log('Sample article already exists');
      }
  
      mongoose.connection.close();
    }
    catch (err) {
      console.error('Error during setup:', err);
    }
  
  }

setup()