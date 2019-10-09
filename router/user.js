const app = require('../server')
const operDb = require('../db/operDb')
const jwt = require('jsonwebtoken');  //用来生成token
app.post('/register', function(req, res) {
    // 注册
    const data = req.body
    // 判断数据库有无有户名
    operDb.search({
        indexData: {
            username: data.username
        },
        name: 'users'
    }).then((result) => {
        if (result.length === 0) {
            return operDb.add({
                data: {
                    username: data.username,
                    password: data.password,
                },
                name: 'users'
            })
        } else {
            res.send({
                code: 400,
                msg: '用户名已经注册 请换一个用户名'
            }) 
        }
    }, (err) => {
        res.send(err)
    }).then(() => {
        res.send({
            code: 200,
            msg: '注册成功'
        })
    }, (err) => {
        res.send(err)
    })
})

app.post('/login', function(req, res) {
    const data = req.body
    operDb.search({
        indexData: {
            username: data.username
        },
        name: 'users'
    }).then((result) => {
        if (result.length !== 0) {
            // 判断是否密码错误
            if (result[0].password !== data.password) {
                res.send({
                    code: 400,
                    msg: '密码错误'
                })
            } else {
                let content ={
                    username: result[0].username,
                    password:result[0].password,
                    user_id: result[0].user_id
                }; // 要生成token的主题信息
                let secretOrPrivateKey="jwt";// 这是加密的key（密钥）
                let token = jwt.sign(content, secretOrPrivateKey, {
                    expiresIn: 60*60*1  // 1小时过期
                })
                res.send({
                    code: 200,
                    msg: '登录成功',
                    token: token,
                    info: {
                        username: data.username
                    }
                })
            }
        } else {
            res.send({
                code: 200,
                msg: '用户不存在'
            })    
        }
    }).catch((err) => {
        res.send(err)  
    })
})

const checkLogin = (req, res) => {
        return new Promise((resolved, rejected) => {
            const token = req.headers.authorization
            const secretOrPrivateKey="jwt";
            jwt.verify(token, secretOrPrivateKey, (err, decode) => {
                if (err) {
                    res.send({
                        code: 401,
                        msg: 'token 失效'
                    })
                    rejected(err)
                } else {
                    resolved(decode)
                }
            })
        })
    }


module.exports = checkLogin