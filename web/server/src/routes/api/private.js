const router = require('express').Router()
const { ObjectID } = require('mongodb')
const sha256 = require('js-sha256');
const db = require('../../db');
const { all } = require('../v/v');
const e = require('express');
const { raw } = require('body-parser');

function check(id, user_list) {
  if (user_list.length != 1) {
    return 0;
  } 
  var sessions = user_list[0].sessions
  var time_now = Math.floor(new Date().valueOf() / 1000)
  
  for (let i in sessions) {
    if (sessions[i].id == id) {
      if (sessions[i].time_of_death > time_now) {
        return 2;
      } else {
        return 1;
      }
    }
  }
  return 0;
}

router.all('*', async (req, res, next) => {
  const db = await load(req)
  if (req.cookies.username && req.cookies.session_id) {
    
    var user = await db.users.find({'username': req.cookies.username}).toArray()
    
    var k = await check(req.cookies.session_id, user)
    if (k == 2) {
      next()
      return;
    } else {
      res.send({
        'success': false,
        'err': 'no such session or it expired'
      })
      return;
    }
  } else {
    res.send({
      'success': false,
      'err': 'no user or session id'
    })
  }


})

router.get('/ping', async (req, res) => {
  try {
    var time_now = Math.floor(new Date().valueOf())
    var db = await load(req)
    var user = await db.users.find({'username': req.cookies.username}).toArray()
    res.send({
      'success': true,
      'time': time_now,
      'role': user[0].role
    })
  } catch (error) {
    console.log(error)
  }
})

function load(req) {
  return {
    "users": req.db.db('tester').collection('users'),
    "tests": req.db.db('tester').collection('tests'),
    "modules": req.db.db('tester').collection('modules'),
    "groups": req.db.db('tester').collection('groups'),
    "tasks": req.db.db('tester').collection('tasks'),
  }
}

module.exports = router