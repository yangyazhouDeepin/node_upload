const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// 上传目录
const uploadFile = path.join(__dirname, '../uploadFile')
const lastNameDir = path.join(__dirname, '../lastName')
const lastNameFile = lastNameDir + '/index.json'

let storage = multer.diskStorage({
    destination (req, file, cb) {
        if (!fs.existsSync(uploadFile)) {
            fs.mkdirSync(uploadFile)
        }
        cb(null, uploadFile)
    },
    filename (req, file, cb) {
        cb(null, file.originalname)
    }
})

let upload = multer({ storage })
let app = express()
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.post('/upload', upload.array('files', 5), (req, res, next) => {
    let obj = {
        android: '',
        ios: ''
    }
    if (!fs.existsSync(lastNameDir)) {
        fs.mkdirSync(lastNameDir)
    } 
    if (fs.existsSync(lastNameFile)) {
        obj = JSON.parse(fs.readFileSync(lastNameFile))
    }
    req.files.forEach(file => {
        if (file.filename.endsWith('.apk')) {
            obj.android = file.filename
            console.log(typeof obj, file.filename)
        }
        if (file.filename.endsWith('.ipa')) {
            obj.ios = file.filename
        }
    })
    console.log(JSON.stringify(obj))
    fs.writeFileSync(lastNameFile, JSON.stringify(obj))
    res.send({code: 200, msg: '传输成功', data: ''})
})

app.listen(3000, '127.0.0.1')
