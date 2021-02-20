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
  if (user_list[0].role != 3) {
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

router.get('/get_groups', async (req, res) => {
  try {
    var db = await load(req)
    var user = await db.users.find({'username': req.cookies.username}).toArray()
    if (user.length == 1) {
      var group_owner = user[0]._id.toString();
      var groups = await db.groups.find({'teacher': group_owner},  {projection: {teacher: 0}}).toArray()
      res.send({
        'success': true,
        groups: groups
      })
      
    } else {
      res.send({
        'success': false,
        'err': 'Пользователь не найден'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/get_tasks', async (req, res) => {
  try {
    var db = await load(req)
    var user = await db.users.find({'username': req.cookies.username}).toArray()
    if (user.length == 1) {
      var task_owner = user[0]._id.toString();
      var tasks = await db.tasks.find({'owner': task_owner},  {projection: {teacher: 0}}).toArray()
      res.send({
        'success': true,
        tasks: tasks
      })
      
    } else {
      res.send({
        'success': false,
        'err': 'Пользователь не найден'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/add_task', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.name && req.body.description && req.body.ans && req.body.module) {
      var user = await db.users.find({'username': req.cookies.username}).toArray()
      var task = await db.tasks.find({'name': req.body.name, 'owner': user[0]._id.toString()}).toArray()

      let module_id = new ObjectID(req.body.module); 
      var module = await db.modules.find({'_id': module_id}).toArray()
      
      if (user.length == 1 && module.length == 1 && task.length == 0) {
        let k = await db.tasks.insertOne({
          'name': req.body.name,
          'description': req.body.description,
          'ans': req.body.ans,
          'owner': user[0]._id.toString()
        })
        await module[0].tasks.push(k.insertedId.toString())
        await db.modules.updateOne({'_id': module_id}, { $set: {'tasks': module[0].tasks} })


        res.send({
          'success': true,
        }) 
      } else {
        res.send({
          'success': false,
          'err': 'Название занято'
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

router.post('/add_module', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.name) {
      var user = await db.users.find({'username': req.cookies.username}).toArray()
      var modules = await db.modules.find({'name': req.body.name, 'owner': user[0]._id.toString()}).toArray()
      if (modules.length == 0) {
        await db.modules.insertOne({
          'name': req.body.name,
          'owner': user[0]._id.toString(),
          'tasks': []
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
        'err': 'Указана не вся информация'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/get_test_rez', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body._id) {
      
      var users = await db.users.find({}).toArray()
      var test_id = new ObjectID(req.body._id); 
      var test = await db.tests.find({'_id': test_id}).toArray()
      
      if (test.length == 1) {
        var rez = []
        for (let i in test[0].results) {
          for (let j in users) {
            if (i == users[j]._id.toString()) {
              rez.push({
                'first_name': users[j].first_name,
                'second_name': users[j].second_name,
                'k':test[0].results[i]
              })
            }
          }
        }
        res.send({
          'success':true,
          'rez': rez
        })
      } else {
        res.send({
          'success': false,
          'err': 'Тест не найден'
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

router.get('/get_modules', async (req, res) => {
  try {
    var db = await load(req)
      var user = await db.users.find({'username': req.cookies.username}).toArray()
      if (user.length == 1) {
        var modules = await db.modules.find({'owner': user[0]._id.toString()}).toArray()
        res.send({
          'success': true,
          'modules': modules  
        })
      } else {
        res.send({
          'success': false,
          'err': 'Пользователь не найден'  
        })
      }

  } catch (error) {
    console.log(error)
  }
})

router.post('/get_module', async (req, res) => {
  try {
    var db = await load(req)
    var module_id = new ObjectID(req.body._id); 
    var module = await db.modules.find({'_id': module_id}).toArray()
    if (module.length == 1) {
      res.send({
        'success': true,
        'module': module[0]
      })
    } else {
      res.send({
        'success': false,
        'err': 'Модуль не найдена'
      })
    }

  } catch (error) {
    console.log(error)
  }
})

router.get('/get_tests', async (req, res) => {
  try {
    var db = await load(req)
    var users = await db.users.find({'username': req.cookies.username}).toArray()
    var tests = await db.tests.find({'owner': users[0]._id.toString()}).toArray()
    
    res.send({
      'success': true,
      'tests': tests
    })
    
  } catch (error) {
    console.log(error)
  }
})

router.post('/get_group', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body._id) {
      let group_id = new ObjectID(req.body._id); 
      var group = await db.groups.find({'_id': group_id}).toArray()
      res.send({
        'success': true,
        'group': group
      })
    } else {
      res.send({
        'success': false,
        'err': 'Не указана группа'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/add_test', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.name && req.body.start_time && req.body.end_time && req.body.options) {
      var tests = await db.tests.find({'name': req.body.name}).toArray()
      var users = await db.users.find({'username': req.cookies.username}).toArray()

      if (tests.length == 0 && users.length == 1) {
        await db.tests.insertOne({
          'name': req.body.name,
          'start_time': req.body.start_time,
          'end_time': req.body.end_time,
          'options': req.body.options,
          'owner': users[0]._id.toString(),
          'results': {}
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
        'err': 'Укажите всю информацию'
      })
    }

  } catch (error) {
    console.log(error)
  }
})

router.post('/add_test_to_group', async (req, res) => {
  try {
    var db = await load(req)
    if (req.body.test_id && req.body.group_id) {
      var test_id = await new ObjectID(req.body.test_id); 
      var group_id = await new ObjectID(req.body.group_id); 
      
      var test = await db.tests.find({'_id': test_id}).toArray()
      var group = await db.groups.find({'_id': group_id}).toArray()

      if (test.length == 1 && group.length == 1) {
        if (!group[0].tests.includes(req.body.test_id)) {
          await group[0].tests.push(req.body.test_id)
          await db.groups.updateOne({'_id': group_id}, { $set: {'tests': group[0].tests} })
          res.send({
            'success': true,
          })
        } else {
          res.send({
            'success': false,
            'err': 'Тест уже добавлен'
          })
        }
      } else {
        res.send({
          'success': false,
          'err': 'Тест или группа не существует'
        })
      }
    } else {
      res.send({
        'success': false,
        'err': 'Укажите тест и группу'
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