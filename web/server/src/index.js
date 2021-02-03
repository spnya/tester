require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')

const app = express()

// Middleware
app.use(express.urlencoded({ extended: false })).use(express.json());
app.use(cors())
app.use(db())

app.get('/', async (req, res) => {
  res.send("OK")
})

const web_port = process.env.WEB_PORT

console.log(web_port)
app.listen(web_port, () => console.log(`Server started on port ${web_port}`))

function exitHandler(options, err) {
  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
  db.close()
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
