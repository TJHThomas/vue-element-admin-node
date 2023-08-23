const express = require('express')
const Result = require('../models/Result')
const {listCase,deleteCase, addOrEditCase, queryOneCase} = require('../services/case')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.get('/list', (req, res, next) => {
    listCase(req.query).then(({list, count, page, pageSize}) => {
        new Result({list, count, page:+page, pageSize:+pageSize}, '获取案例列表成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})
router.get('/delete', (req, res, next) => {
    const { id } = req.query
    if(!id){
        next(boom.badRequest(new Error('删除失败，请联系管理员')))
    }else{
        deleteCase(id).then(() => {
            new Result('删除案例成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})
router.get('/addOrEdit', (req, res, next) => {
    const { id, title,theme_img, content } = req.query
    if(!title || !content || !theme_img){
        next(boom.badRequest(new Error('操作失败，请检查内容')))
    }
    addOrEditCase(id, title,theme_img, content).then(() => {
        new Result('操作成功').success(res)
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
