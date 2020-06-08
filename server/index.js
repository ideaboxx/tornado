const express = require('express')
const app = express()
const path = require('path')

const constant = require('./lib/constants')
const api = require('./api')

// Use to serve the `public` and `download` dir
app.use(express.static(path.join(__dirname, 'build')))
app.use('downloads', express.static(constant.downloadPath))

/** Common APIs */
app.use('/api', api)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})