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
  if (user_list[0].role != 4) {
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

router.get('/get_tests', async (req, res) => {
  try {
    var db = await load(req)
    var user = await db.users.find({'username': req.cookies.username}).toArray()
    var user_id = user[0]._id.toString()
    var k = await db.groups.find({}).toArray()
    var groups = []
    for (let i in k) {
      if (k[i].students.includes(user_id)) {
        groups.push(k[i]._id) 
      }
    }

    var tests = []
    for (let i in groups) {
      let g = await db.groups.find({'_id': groups[i]}).toArray()
      for (let j in g[0].tests) {
        if (!tests.includes(g[0].tests[j])) {
          tests.push(g[0].tests[j])
        }
      }
    }
    var ans = []
    for (let i in tests) {
      var test_id = new ObjectID(tests[i]); 
      let g = await db.tests.find({'_id':test_id}).toArray()
      var time_now = new Date().valueOf()
      if (g[0].start_time < time_now && g[0].end_time > time_now) {
        g[0].results = g[0].results[user_id]
        ans.push(g)
      }
    }

    res.send({
      'success': true,
      'tests': ans
    })

  } catch (error) {
    console.log(error)
  }
})

router.post('/start_test', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body._id) {
      var test_id = new ObjectID(req.body._id); 
      let g = await db.tests.find({'_id':test_id}).toArray()
      if (g.length == 1) {

        var variant = []

        for (let i in g[0].options) {
          let modules_id = new ObjectID(i); 
          let module = await db.modules.find({'_id': modules_id}).toArray()
          module[0].tasks = await module[0].tasks.sort( () => 0.5 - Math.random() );
          console.log(g[0].options[i])
          for (let j = 0; j < g[0].options[i]; j++) {
            variant.push(module[0].tasks[j])
          }
        }

        var user = await db.users.find({'username': req.cookies.username}).toArray()
        
        if (g[0].results[user[0]._id.toString()] == undefined) {
          g[0].results[user[0]._id.toString()] = {
            'variant': variant,
            'status': 1
          }

          await db.tests.updateOne({'_id': g[0]._id }, { $set: {'results': g[0].results} }) 
        
          res.send({
            'success': true,
          })

        } else {
          res.send({
            'success': false,
            'err': "Вы уже начали тест"
          })
        }

        

      } else {
        res.send({
          'success': false,
          'err': 'Тест не найден'
        })
      }
    } else {
      res.send({
        'success': false,
        'err': 'Укажите тест'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/get_test', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body._id) {
      var test_id = new ObjectID(req.body._id); 
      let g = await db.tests.find({'_id':test_id}).toArray()
      var user = await db.users.find({'username': req.cookies.username}).toArray()

      if (g[0].results[user[0]._id.toString()] != undefined) {
        let tasks = g[0].results[user[0]._id.toString()].variant
        
        var ans_tasks = []

        for (let i in tasks) {
          var tasks_id = new ObjectID(tasks[i]); 
          let t = await db.tasks.find({'_id': tasks_id}).toArray()
          ans_tasks.push(t[0]) 
        }

        res.send({
          'success': true,
          'tasks': ans_tasks
        })
        
      } else {
        res.send({
          'success': false,
          'err': 'Тест не начат'
        })
      }
    } else {
      res.send({
        'success': false,
        'err': 'Укажите тест'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/save_ans', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.test_id && req.body.task_id && req.body.ans) {

      var test_id = new ObjectID(req.body.test_id); 
      let g = await db.tests.find({'_id':test_id}).toArray()
      var user = await db.users.find({'username': req.cookies.username}).toArray()
      if (g[0].results[user[0]._id.toString()].variant.includes(req.body.task_id)) {
        if (g[0].results[user[0]._id.toString()].ans == undefined) {
          g[0].results[user[0]._id.toString()].ans = {}
        }
        g[0].results[user[0]._id.toString()].ans[req.body.task_id] = req.body.ans;

        await db.tests.updateOne({'_id': g[0]._id }, { $set: {'results': g[0].results} }) 
        
        res.send({
          'success': true,
        })
      } else {
        res.send({
          'success': false,
          'err': 'Неверное задание'
        })
      }

    } else {
      res.send({
        'success': false,
        'err': 'Укажите тест и задание'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/end_test', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.test_id) {

      var test_id = new ObjectID(req.body.test_id); 
      
      let g = await db.tests.find({'_id':test_id}).toArray()
      console.log(g[0])
      var user = await db.users.find({'username': req.cookies.username}).toArray()
      
      let tasks = g[0].results[user[0]._id.toString()].variant
        
      var right = 0
      var alls = 0
      for (let i in tasks) {
        var tasks_id = new ObjectID(tasks[i]); 
        let t = await db.tasks.find({'_id': tasks_id}).toArray()
        var ans_r = t[0].ans
        console.log(g[0].results)
        var ans_user = g[0].results[user[0]._id.toString()].ans[t[0]._id]
        if (ans_r == ans_user) {
          right += 1;

        }
        alls += 1;
      }

      g[0].results[user[0]._id.toString()].status = 2
      g[0].results[user[0]._id.toString()].mark = Math.round(right/alls*100)

      await db.tests.updateOne({'_id': g[0]._id }, { $set: {'results': g[0].results} }) 

      res.send({
        'success': true,
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