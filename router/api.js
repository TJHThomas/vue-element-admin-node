const express = require('express')
const Result = require('../models/Result')
const {wxListCase, queryOneCase} = require('../services/case')
const boom = require('boom')
const router = express.Router()
const qiniu = require('qiniu')

router.get('/qiniu/token', (req, res, next) => {
    const accessKey = '-s74qCaD5gfLtiFiIeTdI7uulWaEweeqd5TvV4LR'
    const secretKey = 'E1v4dBDgiYqvD3e2WYG2dNohMccIekIpvyA-tPj9'
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const options = {
        scope: 'lebetter',   //这里填写七牛云空间名称
        expires: 7200       //七牛云的有效时长
    }
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    new Result(uploadToken,'获取token成功').success(res)
})

router.get('/case/list', (req, res, next) => {
    wxListCase(req.query).then((list) => {
        new Result({list}, '获取案例列表成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})
router.get('/one', (req, res, next) => {
    const { id } = req.query
    if(!id){
        next(boom.badRequest(new Error('操作失败，请联系管理员')))
    }else{
        queryOneCase(id).then((data) => {
            new Result(data, '查询案例成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})
module.exports = router
