/*
*用作数据库的增删改查
*@surface 表名
*
*
*/ 
const conn = require('./db')
class OperDb {
    constructor() {}
    // 增
    add({name, data = {}}) {
        return new Promise((resloved, rejected) => {
            conn.getConnection((err,connection) => {
                if (err) {
                    rejected({
                        code: 500,
                        msg: '与MySQL数据库建立连接失败！',
                        log: err
                    })
                    console.log('与MySQL数据库建立连接失败！')
                } else {
                    connection.query(`INSERT INTO ${name} SET ?`, { ...data },(err,result) => {
                        if (err) {
                            rejected({
                                code: 501,
                                msg: '插入数据失败',
                                log: err
                            })
                            console.log('插入数据失败')
                            connection.release();
                        } else {
                            resloved(result)
                            connection.release();
                        }
                    })  
                }
            })
        })
    }
    // 删
    deleteDb({name, indexData, type = 'or'} = {}) {
        return new Promise((resloved, rejected) => {
            conn.getConnection((err,connection) => {
                if (err) {
                    rejected({
                        code: 500,
                        msg: '与MySQL数据库建立连接失败！',
                        log: err
                    })
                    console.log('与MySQL数据库建立连接失败！')
                } else {
                    let sql = `delete from ${name} where `  
                    const dataNameStr = []
                    const dataValueArr = []
                    for(const name in indexData) {
                        dataNameStr.push(`${name}=?`)
                        dataValueArr.push(indexData[name])
                    }
                    sql += dataNameStr.join(` ${type} `)
                    connection.query( sql, dataValueArr, (err,result) => {
                        if (err) {
                            rejected({
                                code: 501,
                                msg: '删除数据失败',
                                log: err
                            })
                            console.log('删除数据失败')
                            connection.release();
                        } else {
                            resloved(result)
                            connection.release();
                        }
                    })  
                }
            })
        })
    }
    // 改
    change({name, indexData, data, type = 'or'} = {}) {
        return new Promise((resloved, rejected) => {
            conn.getConnection((err,connection) => {
                if (err) {
                    rejected({
                        code: 500,
                        msg: '与MySQL数据库建立连接失败！',
                        log: err
                    })
                    console.log('与MySQL数据库建立连接失败！')
                } else {
                    const dataNameStr = []
                    let setDataNameStr = ''
                    const dataValueArr = []
                    for(const name in data) {
                        setDataNameStr += `${name}=?,`
                        dataValueArr.push(data[name])
                    }
                    for(const name in indexData) {
                        dataNameStr.push(`${name}=?`)
                        dataValueArr.push(indexData[name])
                    }
                    let whereStr =  dataNameStr.join(` ${type} `)
                    let sql = `update ${name} set ${ setDataNameStr.replace(/,$/, '') } where ${whereStr}`
                    console.log(99999999999, sql, dataValueArr)
                    connection.query( sql, dataValueArr, (err,result) => {
                        if (err) {
                            rejected({
                                code: 501,
                                msg: '修改数据失败',
                                log: err
                            })
                            console.log('修改数据失败')
                            connection.release();
                        } else {
                            resloved(result)
                            connection.release();
                        }
                    })  
                }
            })
        })
    }
    // 查
    search({name, indexData, type = 'or'} = {}) {
        return new Promise((resloved, rejected) => {
            conn.getConnection((err,connection) => {
                if (err) {
                    rejected({
                        code: 500,
                        msg: '与MySQL数据库建立连接失败！',
                        log: err
                    })
                    console.log('与MySQL数据库建立连接失败！')
                } else {
                    const dataNameStr = []
                    const dataValueArr = []
                    let sql = ''
                    if (JSON.stringify(indexData) == "{}") {
                        sql = `select * from ${name}`
                    } else {
                        sql = `select * from ${name} where `
                        for(const name in indexData) {
                            dataNameStr.push(`${name}=?`)
                            dataValueArr.push(indexData[name])
                        }
                        sql += dataNameStr.join(` ${type} `)
                    }
                    connection.query( sql, dataValueArr, (err,result) => {
                        if (err) {
                            rejected({
                                code: 501,
                                msg: '查询数据失败',
                                log: err
                            })
                            console.log('查询数据失败')
                            connection.release();
                        } else {
                            resloved(result)
                            connection.release();
                        }
                    })  
                }
            })
        })
    }
}
const operDb = new OperDb()
// const addDb = new Promise((resloved, rejected) => {
//     conn.getConnection((err,connection) => {
//         if (err) {
//             rejected({
//                 code: 500,
//                 msg: '与MySQL数据库建立连接失败！',
//                 log: err
//             })
//         } else {
//             connection.query('INSERT INTO users SET ?', {
//                 users: 'haha',
//                 passname: 886666
//             },(err,result) => {
//                 console.log(err)
//                 if (err) {
//                     console.log('插入数据失败');
//                     connection.release();
//                 } else {
//                     console.log('插入数据成功');  
//                     connection.release();
//                 }
//             })  
//         }
//     })
// })

module.exports = operDb