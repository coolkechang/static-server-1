var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)
  //下面设置一个静态服务器，只要是支持的fileType，都可以在页面正确的显示以及正确设置Content-Type

  response.statusCode = 200
  const filePath = path === '/' ? '/index.html' : path
  //默认首页。如果文件路径是 / 。默认是 /index.html，否则是输入的路径
  const index = filePath.lastIndexOf('.')
  //lastIndexOf() 方法返回字符串中指定值最后一次出现的索引（下标）。没有返回 -1
  const suffix = filePath.substring(index)
  //suffix：后缀
  //substring() 方法返回字符串的子字符串
  const fileType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  }
  //用哈希表将'.js' '.css' '.html'等变成'text/js' 'text/css' 'text/html'...
  response.setHeader('Content-Type', `${fileType[suffix] || 'text/html'};charset=utf-8`)
  let content
  try {
    content = fs.readFileSync(`./public/${filePath}`)
  } catch (error) {
    content = '文件不存在'
    response.statusCode = 404
  }
  response.write(content)
  response.end()

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)