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
  if (user_list[0].role != 1) {
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

router.post('/get_student_marks', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body._id) {
      var user_id = new ObjectID(req.body._id);
      var user = await db.users.find({'_id': user_id}).toArray()
      if (user.length == 1) {
        var tests = await db.tests.find({}).toArray()
        
        ans = []

        for (let i in tests) {
          if (tests[i].results[user[0]._id.toString()] != undefined && tests[i].results[user[0]._id.toString()].mark != undefined) {
            await ans.push({
              'name': tests[i].name,
              'mark': tests[i].results[user[0]._id.toString()].mark,
            })
          }
        }

        res.send({
          'success': true,
          'ans': ans
        })

      } else {
        res.send({
          'success': false,
          'err': "Ученик не найден"
        })
      }
    } else {
      res.send({
        'success': false,
        'err': "Укажите ученика"
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

router.post('/get_teacher_groups', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body._id) {
      console.log(req.body._id)
      var groups = await db.groups.find({'teacher': req.body._id}).toArray()
      if (groups.length > 0) {
        res.send({
          'success': true,
          'groups': groups
        })
      } else {
        res.send({
          'success': false,
          'err': "Группа не найдена"
        })
      }
    } else {
      res.send({
        'success': false,
        'err': "Укажите ученика"
      })
    }
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


router.post('/get_test', async (req, res) => {
  try {
    var db = await load(req)
    var test_id = new ObjectID(req.body._id); 
    var tests = await db.tests.find({'_id': test_id}).toArray()
    if (tests.length == 1) {
      res.send({
        'success': true,
        'tests': tests[0]
      }) 
    } else {
      res.send({
        'success': false,
        'err': 'Тест не найден'
      })
    }
    
    
  } catch (error) {
    console.log(error)
  }
})


router.post('/get_task', async (req, res) => {
  try {
    var db = await load(req)
    var task_id = new ObjectID(req.body._id); 
    var tasks = await db.tasks.find({'_id': task_id}).toArray()
    if (tasks.length == 1) {
      res.send({
        'success': true,
        'tasks': tasks[0]
      }) 
    } else {
      res.send({
        'success': false,
        'err': 'Тест не найден'
      })
    }
    
    
  } catch (error) {
    console.log(error)
  }
})

router.get('/get_tests', async (req, res) => {
  try {
    var db = await load(req)
    var tests = await db.tests.find({}).sort({ 'start_time' : 1 }).toArray()
    
    res.send({
      'success': true,
      'tests': tests
    })
    
  } catch (error) {
    console.log(error)
  }
})

router.get('/get_tasks', async (req, res) => {
  try {
    var db = await load(req)
      var tasks = await db.tasks.find({}, {projection: {teacher: 0}}).toArray()
      res.send({
        'success': true,
        tasks: tasks
      })
      
  } catch (error) {
    console.log(error)
  }
})


module.exports = router