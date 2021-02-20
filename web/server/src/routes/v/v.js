const router = require('express').Router()
const { ObjectID } = require('mongodb') 

var path = __dirname + '/views/';

router.get('/', async (req, res) => {
  res.sendFile(path+'index.html')
})

router.get('/dev', async (req, res) => {
  res.sendFile(path+'dev.html')
})

router.get('/admin', async (req, res) => {
  res.sendFile(path+'admin.html')
})

router.get('/teacher', async (req, res) => {
  res.sendFile(path+'teacher.html')
})

router.get('/student', async (req, res) => {
  res.sendFile(path+'student.html')
})

router.get('/organizer', async (req, res) => {
  res.sendFile(path+'organizer.html')
})

module.exports = router