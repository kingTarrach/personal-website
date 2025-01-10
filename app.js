const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const router = express.Router();
const port = 3000;
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const BlogPost = require('./models/blogPost');
const Comment = require('./models/comments');
const app = express();

require('./config/passport')(passport);

const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/users');
const dataRoutes = require('./routes/data');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: 'big14bitchyea', // This is a secret key to sign the session ID cookie.
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: { secure: false } // True is recommended if your site is HTTPS only
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// View Engine
app.set('view engine', 'ejs');  // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));  // Directory where EJS templates are located

// Set up express
app.use(express.json());
// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', userRoutes);
app.use('/', articleRoutes);
app.use('/data', dataRoutes);

// Connect to mongo database
MONGO_URI = process.env.MONGODB_URI
mongoose.connect(MONGO_URI)
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


// Following implementation is to be able to add an article
const ADMIN_USERNAME = 'austindeantarrach';
const ADMIN_PASSWORD = 'big14bitchyea';

// 1. This renders the admin login page
app.get('/admin/login', (req, res) => {
  res.render('admin-login');  // Create admin-login.ejs for the form
});

// 2. This verifies the admin login and redirects if successful
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Check if credentials match
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;  // Store authentication status in session
    res.redirect('/admin/add-article');  // Redirect to article submission page
  } else {
    req.flash('error_msg', 'Invalid username or password');
    res.redirect('/admin/login');
  }
});

// 3. Add article route
app.get('/admin/add-article', (req, res) => {
  if (!req.session.isAuthenticated) {
    req.flash('error_msg', 'You must be logged in to access this page');
    return res.redirect('/admin/login');
  }
  res.render('add-article');  // Create add-article.ejs for the article form
});

// 4. Route for adding articles
router.post('/admin/add-article', async (req, res) => {
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

// 5. Admin Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy();  // Destroy session
  res.redirect('/admin/login');
});


// Initialize articles and likes
let likes = 0;
let articles = [];

app.get('/', (req, res) => {
   res.render('austin_tarrach', { articles: articles });  // Render the 'articles' view with the articles data
});

app.get('/blog_homepage', async (req, res) => {
  try {
    const articles = await BlogPost.find().sort({ date: -1 }); // Fetch latest articles and sort by date
    res.render('blog_homepage', { articles: articles });
  } catch (err) {
    res.status(500).send('Server error');
  }
  
});

app.post('/blog_post/:postId', (req, res) => {
  const postId = req.params.postId;  // Capture the postId from URL
  const { name, comment } = req.body;  // Extract name and comment from the form data

  articles.findById(postId)
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
    date: new Date()  // Automatically set the date when posting
  });

  newArticle.save()
  .then(article => {
    // Format the date before sending the response
    const formattedDate = article.date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    res.status(201).json({
      id: article._id,
      title: article.title,
      content: article.content,
      date: formattedDate
    });
  })
  .catch(err => res.status(500).send('Server error.'));
});



app.get('/articles', async (req, res) => {
  let page = parseInt(req.query.page) || 1; // Get the page number, default is 1
  console.log("Requested page number:", page); // Logs the current page number

  let limit = 25; // Number of articles per page
  let offset = (page - 1) * limit; // Calculate the offset
  console.log("Offset for slicing the articles array:", offset); // Logs the offset

  try {
    // Fetch total number of articles
    const totalArticles = await BlogPost.countDocuments();
    // Fetch articles for the current page
    const paginatedArticles = await BlogPost.find().skip(offset).limit(limit);

    console.log("Number of articles on the current page:", paginatedArticles.length); // Logs how many articles are on the current page

    let totalPages = Math.ceil(totalArticles / limit); // Calculate total number of pages
    console.log("Total number of pages:", totalPages); // Logs the total number of pages

    // Check for empty page (no articles)
    if (paginatedArticles.length === 0) {
      console.log("No articles found for this page:", page);
      // Optionally handle the case where an empty page is requested
    }

    res.render('article_list', {
      articles: paginatedArticles,
      currentPage: page,
      totalPages: totalPages 
    });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).send('Server error');
  }
});

// Middleware for basic authentication
function auth(req, res, next) {
  const user = basicAuth(req);
  const validUser = { name: 'austin-tarrach', pass: 'MakingAWebsite!9' };
  if (!user || user.name !== validUser.name || user.pass !== validUser.pass) {
      res.set('WWW-Authenticate', 'Basic realm="example"');
      return res.status(401).send('Authentication required.');
  }
  next();
}

app.get('/admin', auth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Get current likes
app.get('/likes', (req, res) => {
  res.json({ likes });
});

// Routes for likes and comments
app.post('/like', (req, res) => {
  const { like } = req.body;
  if (like) {
    likes += 1; // Increment if liked
  } else {
    likes -= 1; // Decrement if unliked
  }
  console.log("Total likes now:", likes);
  res.json({ likes });
});

// Get current comments
app.get('/comments', (req, res) => {
  Comment.find(function (err, comments) {
    if (err) return console.error(err);
    res.json({ comments });
  });
});

app.post('/comment', (req, res) => {
  const newComment = new Comment({ name: req.body.name, comment: req.body.comment });
  newComment.save(function (err, savedComment) {
    if (err) return console.error(err);
    res.json(savedComment);
  });
});

app.post('/submit-comment', (req, res) => {
  const { name, comment } = req.body;

  // Create a new comment instance
  const newComment = new Comment({
      name: name || "Anonymous",
      comment: comment
  });

  // Save the comment to the database
  newComment.save()
      .then(savedComment => {
          // Format the date as required before sending the response
          const formattedDate = savedComment.timestamp.toLocaleString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });
          res.json({
              id: savedComment._id,
              name: savedComment.name,
              comment: savedComment.comment,
              timestamp: formattedDate
          });
      })
      .catch(err => {
          console.error('Error saving comment:', err);
          res.status(500).send("Failed to save comment.");
      });
});

app.post('/like-comment', (req, res) => {
  const { commentId } = req.body;
  const comment = findCommentById(comments, commentId); // Assume this function traverses and finds the comment
  if (comment) {
      comment.likes += 1;
  }
  res.json({ comments });
});

app.post('/reply-comment', (req, res) => {
  const { commentId, name, comment } = req.body;
  const parentComment = findCommentById(comments, commentId); // This needs to correctly handle nesting
  if (parentComment) {
      const newComment = { id: getNextId(), name, comment, timestamp: new Date(), likes: 0, replies: [] };
      parentComment.replies.push(newComment);
  }
  res.json({ comments });
});


app.listen(port, () => {
  console.log("App up and running!");
});
