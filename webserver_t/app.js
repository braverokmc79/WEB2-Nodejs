const http = require('http');
const fs = require('fs');
const url = require("url");



function templateHTML(title, menuList, body) {
  return `
    <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>${menuList}</ol>
            ${body}
    </body>
    </html>       
  `;
}

function templateList(filelist) {
  let menuList = "";
  filelist.forEach(item => {
    menuList += `<li><a href="?id=${item}">${item}</a></li>`;
  })
  return menuList;
}

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  let title = queryData.id;


  if (pathname === '/') {

    //readdirSync 동기식처리 파일 목록 읽기
    const filelist = fs.readdirSync('../data');
    let menuList = templateList(filelist);

    fs.readFile(`../data/${queryData.id}`, 'utf-8', function (err, description) {
      if (queryData.id === undefined) {
        title = "Welcome";
        description = "Hello, Node.js";
      }

      const template = templateHTML(title, menuList, `<h2>${title}</h2>${description}`);
      response.writeHead(200);
      response.end(template);
    });

  } else {
    response.writeHead(400);
    response.end("Not found");
  }

});
app.listen(3000);