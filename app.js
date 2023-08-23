const express = require('express')
const router = require('./router')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', router)

// 设置https和相应接口
// const privateKey = fs.readFileSync('./https/...key', 'utf8')
// const certificate = fs.readFileSync('./https/...pem', 'utf8')
// const credentials = { key: privateKey, cert: certificate }
// const httpsServer = https.createServer(credentials, app)
// const SSLPORT = 18082
const server = app.listen(5000, () => {
    const {address, port} = server.address()
    console.log('HTTP服务启动成功： http://localhost:%s',port)
})
// https
// httpServer.listen(18082, function(){
//     console.log('HTTP服务启动成功： https://%s:%s', 18082)
// })
