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
  if (user_list[0].role != 2) {
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

router.get('/get_teachers', async (req, res) => {
  try {
    var db = await load(req)
    var teachers = await db.users.find({role: 3}, {projection: { password: 0, role: 0 }}).toArray()
    res.send({
      'success': true,
      'teachers': teachers
    })
  } catch (error) {
    console.log(error)
  }
})


router.get('/get_groups', async (req, res) => {
  try {
    var db = await load(req)
    var groups = await db.groups.find({}).toArray()
    res.send({
      'success': true,
      'groups': groups
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/get_students', async (req, res) => {
  try {
    var db = await load(req)
    var students = await db.users.find({role: 4}, {projection: { password: 0, role: 0 }}).toArray()
    res.send({
      'success': true,
      'students': students
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/get_group', async (req, res) => {
  try {
    var db = await load(req)
    var group_id = new ObjectID(req.body._id); 
    var group = await db.groups.find({'_id': group_id}).toArray()
    if (group.length == 1) {
      res.send({
        'success': true,
        'group': group[0]
      })
    } else {
      res.send({
        'success': false,
        'err': 'Группа не найдена'
      })
    }

  } catch (error) {
    console.log(error)
  }
})

router.post('/reg_user', async (req, res) => {
    try {
      var db = await load(req)
      if (req.body.username && req.body.password && req.body.role && req.body.first_name && req.body.second_name && parseInt(req.body.role)  > 0 && parseInt(req.body.role) < 5) {
        var user_list = await db.users.find({"username": req.body.username}).toArray()
        if (user_list.length == 0) {
          var psw_hash = sha256(req.body.password)
          await db.users.insertOne({
            "username": req.body.username,
            "password": psw_hash,
            "role": parseInt(req.body.role),
            "first_name": req.body.first_name,
            "second_name": req.body.second_name,
          })
          res.send({
            'success': true,
          })
        } else {
          res.send({
            'success': false,
            'err': 'Username занят'
          })
        }
      } else {
        res.send({
          'success': false,
          'err': 'Указана не вся информация'
        })
      }
    } catch (error) {
      console.log(error)
    }
})

router.post('/add_group', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.teacher_id && req.body.name) {
      var user_id = new ObjectID(req.body.teacher_id); 
      var user_list = await db.users.find({"_id": user_id}).toArray()
      var group_list = await db.groups.find({"name": req.body.name}).toArray()
      
      if (user_list.length == 1) {
        if (group_list.length == 0) {
          await db.groups.insertOne({
            'name': req.body.name,
            'teacher': req.body.teacher_id,
            'students': [],
            'tests': [],
            'results': []
          })

          res.send({
            'success': true,
          })

        } else {
          res.send({
            'success': false,
            'err': 'Имя занято'
          })  
        }
      } else {
        res.send({
          'success': false,
          'err': 'Учитель не найден'
        })
      }
    } else {
      res.send({
        'success': false,
        'err': 'Укажите имя группы'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/add_user_to_group', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.student_id && req.body.group_id) {
      var student_id = await new ObjectID(req.body.student_id); 
      var group_id = await new ObjectID(req.body.group_id); 
      
      var student = await db.users.find({'_id': student_id}).toArray()
      var group = await db.groups.find({'_id': group_id}).toArray()

      if (student.length == 1 && group.length == 1) {
        if (!group[0].students.includes(req.body.student_id)) {
          await group[0].students.push(req.body.student_id)
          await db.groups.updateOne({'_id': group_id}, { $set: {'students': group[0].students} })
          res.send({
            'success': true,
          })
        } else {
          res.send({
            'success': false,
            'err': 'Пользователь уже есть в группе'
          })
        }
      } else {
        res.send({
          'success': false,
          'err': 'Пользователь или группа не существует'
        })
      }
    } else {
      res.send({
        'success': false,
        'err': 'Укажите группу и ученика'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/del_user_from_group', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.student_id && req.body.group_id) {
      var student_id = await new ObjectID(req.body.student_id); 
      var group_id = await new ObjectID(req.body.group_id); 
      
      var student = await db.users.find({'_id': student_id}).toArray()
      var group = await db.groups.find({'_id': group_id}).toArray()

      if (student.length == 1 && group.length == 1) {
        console.log(group[0].students, student_id)
        group[0].students = await group[0].students.filter(function(value, index, arr){ 
          return value != req.body.student_id;
        });
        console.log(group[0].students, student_id)
        await db.groups.updateOne({'_id': group_id}, { $set: {'students': group[0].students} })
        res.send({
            'success': true,
        })
      } else {
        res.send({
          'success': false,
          'err': 'Пользователь или группа не существует'
        })
      }
    } else {
      res.send({
        'success': false,
        'err': 'Укажите группу и ученика'
      })
    }
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