var qr_image = require('qr-image');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.set('trust proxy', true);   //支持代理后面获取用户真实ip

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, Authorization, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    if (req.method == 'OPTIONS')
        res.sendStatus(200);
    else
        next();
});

var port = 80;
var prefix = '';
process.env['port'] && (port = process.env['port']);
process.env['prefix'] && (prefix = process.env['prefix']);

//直接生成二维码图片返回前端
app.get(prefix + '/', function (req, res) {
    var text = req.query.text || req.body.text || '';
    var temp_qrcode = qr_image.image(text, {margin: 1});
    res.type('png');
    temp_qrcode.pipe(res);
});

http.createServer(app).listen(port, function () {
    console.info('Express server listening on port ' + port);
});

process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err.stack);
});
