const express = require('express')
const Result = require('../models/Result')
const {login, findUser, reset} = require('../services/user')
const {md5, decoded} = require('../utils')
const {PWD_SALT, PRIVATE_KEY, JWT_EXPIRED} = require('../utils/constant')
const {body, validationResult} = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const router = express.Router()


router.post(
    '/login',
    [
        body('username').isString().withMessage('用户名必须为字符'),
        body('password').isString().withMessage('密码必须为字符'),
    ],
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            const [{msg}] = err.errors
            next(boom.badRequest(msg))
        } else {
            let {username, password} = req.body
            password = md5(`${password}${PWD_SALT}`)

            login(username, password).then(user => {
                if (!user || user.length === 0) {
                    new Result('登录失败').fail(res)
                } else {
                    const token = jwt.sign(
                        {username},
                        PRIVATE_KEY,
                        {expiresIn: JWT_EXPIRED}
                    )
                    new Result({token}, '登录成功').success(res)
                }
            })
        }
    })

router.post(
    '/reset',
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            const [{msg}] = err.errors
            next(boom.badRequest(msg))
        } else {
            let {pwd1} = req.body
            const password = md5(`${pwd1}${PWD_SALT}`)

            reset(password).then(result => {
                if (!result) {
                    new Result('修改失败').fail(res)
                } else {
                    new Result('修改成功').success(res)
                }
            })
        }
    })

router.get(
    '/restart',
    (req, res, next) => {
        const password = md5(`lebetter123${PWD_SALT}`)
        reset(password).then(result => {
            if (!result) {
                new Result('重置失败').fail(res)
            } else {
                new Result('重置成功').success(res)
            }
        })

    })

router.get('/info', (req, res, next) => {
    const decode = decoded(req)
    if (decode && decode.username) {
        findUser(decode.username).then(user => {
            if (user) {
                user.roles = ['admin']
                new Result(user, '用户信息查询成功').success(res)
            } else {
                new Result('用户信息查询失败').fail(res)
            }
        })
    } else {
        new Result('用户信息查询失败').fail(res)
    }
})
module.exports = router
