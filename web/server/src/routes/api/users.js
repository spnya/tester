const router = require('express').Router()
const { ObjectID } = require('mongodb')

// Get Users
router.get('/', async (req, res) => {
  const users = load(req)
  res.send("OK")
})

module.exports = router