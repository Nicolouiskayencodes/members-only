const passport = require('passport');
const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');

const login = passport.authenticate('local', {
  successRedirect: "/login-success",
  failureRedirect: "/login-failure"
});

const register = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      await pool.query("INSERT INTO users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4)", [
        req.body.username,
        hashedPassword,
        req.body.firstname,
        req.body.lastname
      ]);
      res.redirect("/login");
    } catch(err) {
      return next(err);
    }
  })
}

const index = async (req, res, next) => {
  try{
    let messages = await db.getAllMessages()
    console.log(messages)
    res.render('index', {messages: messages})
  } catch (err){
    return next(err)
  }
}

const loginForm = (req, res, next) => {
  res.render('login')
}

const registerForm = (req, res, next) => {
  res.render('register')
}

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  }
  );
}

const redirectIndex = (req, res, next) => {
  res.redirect('/');
}

const loginFailure =  (req, res, next) => {
  res.render('login', {errors:[{msg:'Username or password did not match'}]})
}

const membership = (req, res, next) => {
  res.render('membership')
}

const addMember = async (req, res, next) => {
  if (req.body.membership === process.env.MEMBER_PASSWORD) {
    try { 
      await db.addMember(res.locals.currentUser.id)
      res.redirect('/')
    } catch (err) {
      return next(err);
    }
  } else {
    res.render('membership', {errors:[{msg:'Membership password was incorrect'}]})
  }
}

const messageForm = (req, res) => {
  res.render('message');
}

const createMessage = async (req, res, next) => {
  try {
    await db.createMessage(req.body.title, req.body.message_body, res.locals.currentUser.id);
    res.redirect('/')
  } catch (err) {
    return next(err);
  }
}

module.exports = {login, register, index, loginForm, registerForm, logout, redirectIndex, loginFailure, membership, addMember, messageForm, createMessage}