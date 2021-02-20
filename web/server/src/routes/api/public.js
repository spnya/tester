const router = require('express').Router()
const { ObjectID } = require('mongodb')
const sha256 = require('js-sha256');
const db = require('../../db');

router.post('/auth', async (req, res) => {
  try {
    const users = await load(req)
    console.log(req.body)
  
    if (req.body.username && req.body.password) {
      var user = await users.find({'username': req.body.username}).toArray()
      var pwd_hash = sha256(req.body.password)
      if (user.length > 0 && user[0].password == pwd_hash) {
        var new_session_id = sha256(user[0].password + req.body.username + Math.random().toString())
        var _id = new ObjectID(user[0]._id); 
        var sessions = user[0].sessions
        var time_now = Math.floor(new Date().valueOf() / 1000)
        var time_of_death = time_now + 1200000000
        if (sessions == undefined) {
          sessions = []
        }
        sessions.push({
          'id': new_session_id,
          'time_of_death': time_of_death
        })
        
        await users.updateOne({'_id': _id} , { $set: {'sessions':sessions} })
        
        res.send({
          'success': true,
          'session_id': new_session_id,
          'time_of_death': time_of_death
        })
  
      } else {
        res.send({
          'success': false,
          'err': 'Неверный логин или пароль'
        })
      }
    } else {
      res.send({
        'success': false,
        'err': 'Не указан логин или пароль'
      })
    }
  } catch (error) {
    console.log(error)
  }

})

function load(req) {
  return req.db.db('tester').collection('users')
}

module.exports = router