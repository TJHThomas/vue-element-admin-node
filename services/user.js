const {querySql, queryOne, updateOne} = require("../db");
function login(username, password){
    return querySql(`select * from le_admin where username ='${username}' and password='${password}'`)
}

function findUser(username){
    return queryOne(`select * from le_admin where username='${username}'`)
}
function reset(password){
    return updateOne(`update le_admin set password='${password}' where username='admin'`)
}

module.exports = {
    login,
    findUser,
    reset,
}
