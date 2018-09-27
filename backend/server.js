const express = require('express')
const app = express()
const port = 3000

app.use('/to-do-list/frontend', express.static('frontend'))


app.get('/to-do-list/backend', function (req, res) {
  res.send('Server Running!')
})

app.listen(port, () => console.log(`Back-End server on port ${port}`))