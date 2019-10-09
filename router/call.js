const checkLogin = require('./user')
const app = require('../server')
const operDb = require('../db/operDb')

app.post('/call/add', function(req, res) {
    checkLogin(req, res).then((info) => {
        const data = req.body
        return operDb.add({
            data: {
                username: info.username,
                content: data.content,
                create_time: new Date()
            },
            name: 'leave_msg'
        }).then((result) => {
            res.send({
                code: 200,
                msg: '评论成功',
                data: result
            }) 
        }).catch((err) => {
            res.send(err)
        })
    })
})

app.post('/call/list', function(req, res) {
    checkLogin(req, res).then((info) => {
        const data = req.body
        return operDb.search({
            indexData: {},
            name: 'leave_msg'
        }).then((result) => {
            res.send({
                code: 200,
                msg: '查询成功',
                data: result
            }) 
        }).catch((err) => {
            res.send(err)
        })
    })
})

