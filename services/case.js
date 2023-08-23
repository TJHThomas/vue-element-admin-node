const {querySql, andlike, queryOne} = require("../db");
const {debug} = require('../utils/constant')

async function listCase(query) {
    debug && console.log(query)
    const {
        title,
        sort,
        page = 1,
        pageSize = 20
    } = query
    const offset = (page - 1) * pageSize
    let caseSql = 'select * from le_case'
    let where = 'where'
    title && (where = andlike(where, 'title', title))
    if (where !== 'where') {
        caseSql = `${caseSql} ${where}`
    }
    if (sort) {
        const symbol = sort[0]
        const column = sort.slice(1, sort.length)
        const order = symbol === '+' ? 'asc' : 'desc'
        caseSql = `${caseSql} order by \`${column}\` ${order}`
    }
    let countSql = `select count(*) as count from le_case`
    if (where !== 'where') {
        countSql = `${countSql} ${where}`
    }
    const count = await querySql(countSql)
    caseSql = `${caseSql} limit ${pageSize} offset ${offset}`
    const list = await querySql(caseSql)
    return {list, count: count[0].count, page, pageSize}
}

async function wxListCase(query) {
    const {
        page,
        limit
    } = query
    const offset = (page - 1) * limit
    let caseSql = 'select * from le_case'
    let countSql = `select count(*) as count from le_case`
    const count = await querySql(countSql)
    caseSql = `${caseSql} limit ${limit} offset ${offset}`
    const list = await querySql(caseSql)
    return {list, count: count[0].count}
}
function getCase(id){
    return new Promise(async (resolve,reject)=>{
        const caseSql =`select * from le_case where id = ${id}`
        const caseItem = await queryOne(caseSql)
        if(caseItem){
            resolve(caseItem)
        }else{
            reject(new Error('案例不存在'))
        }
    })
}
function deleteCase(id){
    return new Promise(async (resolve,reject)=>{
        let caseItem = await getCase(id)
        const sql = `delete from le_case where id=${id}`
        querySql(sql).then(()=>{
            resolve()
        })
    })
}
function addOrEditCase(id, title,theme_img, content){
    return new Promise(async (resolve,reject)=>{
        let sql = ''
        const currentData = Math.floor((new Date().getTime())/1000)
        if(!+id){
            sql = `insert into le_case(title,count, content,theme_img,createDate,updateDate) 
                     values('${title}',0, '${content}','${theme_img}', '${currentData}', '${currentData}')`
        }else{
            sql = `update le_case set title='${title}',content='${content}',theme_img='${theme_img}',updateDate='${currentData}' where id=${id}`
        }

        querySql(sql).then(()=>{
            resolve()
        })
    })
}
function queryOneCase(id){
    return new Promise(async (resolve,reject)=>{
        const sql = `select * from le_case where id = ${id}`
        querySql(sql).then((res)=>{
            resolve(res[0])
        })
    })
}

module.exports = {
    listCase,
    deleteCase,
    addOrEditCase,
    queryOneCase,
    wxListCase,
}
