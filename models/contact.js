
const mongoose = require('mongoose');

// Define a Mongoose schema and model for contact submissions
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    submittedAt: { type: Date, default: Date.now },
  });
  
const ContactSubmission = mongoose.model('ContactSubmission', contactSchema);

module.exports = ContactSubmission;