const express = require('express')
const boom = require('boom')
const userRouter = require('./user')
const caseRouter = require('./case')
const apiRouter = require('./api')
const Result = require('../models/Result')
const jwtAuth = require('./jwt')

// 注册路由
const router = express.Router()

router.use(jwtAuth)

router.get('/', (req, res) => {
    res.send('欢迎欢迎！')
})

router.use('/user', userRouter)
router.use('/case', caseRouter)
router.use('/api', apiRouter)

/**
 * 集中处理404请求的正常中间件
 * 要放在正常处理流程之后，不然正常请求会被拦截
 */
router.use((req, res, next) => {
    next(boom.notFound('接口不存在'))
})

/**
 * 自定义路由异常处理中间件
 */
router.use((err, req, res, next) => {
    if (err.name && err.name === 'UnauthorizedError') {
        const {status = 401, message} = err
        new Result(null, 'Token验证失败', {
            error: status,
            errMsg: message
        }).jwtError(res.status(status))
    } else {
        const msg = (err && err.message) || '系统错误'
        const statusCode = (err.output && err.output.statusCode) || 500
        const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
        new Result(null, msg, {
            error: statusCode,
            errorMsg
        }).fail(res.status(statusCode))
    }
})

module.exports = router
