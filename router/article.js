const checkLogin = require('./user')
const app = require('../server')
const operDb = require('../db/operDb')
app.post('/article/add', function(req, res) {
    checkLogin(req, res).then((info) => {
        const data = req.body
        return operDb.add({
            data: {
                title: data.title,
                type: data.type,
                content: data.content,
                update_time: new Date()
            },
            name: 'article'
        })
    }, () => {

    }).then(() => {
        res.send({
            code: 200,
            msg: '添加成功'
        })
    }, (err) => {
        res.send(err)
    })
})

app.post('/article/list', function(req, res) {
    checkLogin(req, res).then((info) => {
        const data = req.body
        return operDb.search({
            indexData: {
               type: data.type
            },
            name: 'article'
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

app.post('/article/detail', function(req, res) {
    checkLogin(req, res).then((info) => {
        const data = req.body
        return operDb.search({
            indexData: {
               id: data.id
            },
            name: 'article'
        }).then((result) => {
            res.send({
                code: 200,
                msg: '查询成功',
                data: result[0]
            }) 
        }).catch((err) => {
            res.send(err)
        })
    })
})