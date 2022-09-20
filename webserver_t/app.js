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
            <a href="/create">create</a>
            ${body}
    </body>
    </html>       
  `;
}

function templateList(filelist) {
  let menuList = "";
  filelist.forEach(item => {
    menuList += `<li><a href="/?id=${item}">${item}</a></li>`;
  })
  return menuList;
}

//공통 페이지 메뉴
function commonPage(queryData, response, head, body) {
  fs.readFile(`../data/${queryData.id}`, 'utf-8', function (err, description) {
    let title = queryData.id;
    if (head === "main") {
      if (queryData.id === undefined) {
        title = "Welcome";
        description = "Hello, Node.js";
      }
      body = `<h2>${title}</h2>${description}`;
    } else if (head === "create") {
      title = "CREATE";
    }

    const template = templateHTML(title, templateList(fs.readdirSync('../data')), body);
    response.writeHead(200);
    response.end(template);
  });
}


const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;


  if (pathname === '/') {
    commonPage(queryData, response, "main", "");


  } else if (pathname === '/create') {
    commonPage(queryData, response, "create", `<form action="http://localhost:300/process_create" method="post">
        <p><input type="text" name="title" placeholder=""></p>
        <p><textarea name="description" style="width:200px; height:150px" ></textarea></p>
        <p><input type="submit"></p>
      </form>`);

  } else {
    response.writeHead(400);
    response.end("Not found");
  }

});
app.listen(3000);