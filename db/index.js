const mysql = require('mysql')
const {host, user, password, database} = require('./config')
const {debug} = require('../utils/constant')

function connect() {
    return mysql.createConnection({
        host,
        user,
        password,
        database,
        multipleStatements: true
    })
}

function querySql(sql) {
    const conn = connect()
    debug && console.log(sql)
    return new Promise((resolve, reject) => {
        try {
            conn.query(sql, (err, results) => {
                if (err) {
                    debug && console.log('操作失败，原因：' + JSON.stringify(err))
                    reject(err)
                } else {
                    debug && console.log('操作成功' + JSON.stringify(results))
                    resolve(results)
                }
            })
        } catch (e) {
            reject(e)
        } finally {
            conn.end()
        }
    })
}

function queryOne(sql) {
    return new Promise((resolve, reject) => {
        querySql(sql).then(results => {
            if (results && results.length > 0) {
                resolve(results[0])
            } else {
                resolve(null)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

function updateOne(sql) {
    return new Promise((resolve, reject) => {
        querySql(sql).then(results => {
            if (results && results.affectedRows > 0) {
                resolve(results.affectedRows)
            } else {
                resolve(null)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

function andlike(where, k, v) {
    if (where === 'where') {
        return `${where}\`${k}\`like'%${v}%'`
    } else {
        return `${where} and \`${k}\`like'%${v}%'`
    }
}
function and(where, k, v) {
    if (where === 'where') {
        return `${where}\`${k}\`like'${v}'`
    } else {
        return `${where} and \`${k}\`like'${v}'`
    }
}
module.exports = {
    querySql,
    queryOne,
    updateOne,
    andlike,
    and
}
