// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

  userId: {
    type: Number,
    required: false, 
    unique: true, 
    
    
  },
  username: {
    type: String,
    required: false,
    unique: true
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: false
  }, 
  mobile: {
    type: String, 
    required: true, 
    unique: false
  }, 

  accessRights: {
    type: Number, 
    required: false, 
    unique: false
  }, 

  token: {
    type: String, 
    required: false, 
    unique: false
  }

});

// Pre-save middleware to generate auto-incrementing userId
userSchema.pre('save', async function(next) {
    try {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        // Hash the password using bcrypt or any other library
        const hashedPassword =  bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
      }
    if (!this.isNew) {
      return  next();
    }
        const maxUserId = await mongoose.model('User').findOne({}, {}, { sort: { 'userId': -1 } });
      user.userId = maxUserId ? maxUserId.userId + 1 : 1;
     
      return next();
    } catch (error) {
      return next(error);
    }
  });
  

const User = mongoose.model('User', userSchema);

module.exports = User;
