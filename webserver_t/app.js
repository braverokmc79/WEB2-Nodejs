const http = require('http');
const fs = require('fs');
const url = require("url");

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  let title = queryData.id;
  let menuList = "";



  if (pathname === '/') {

    //readdirSync 동기식처리
    let filelist = fs.readdirSync('../data');
    filelist.forEach(item => {
      menuList += `
                <li><a href="?id=${item}">${item}</a></li>
            `;
    })


    fs.readFile(`../data/${queryData.id}`, 'utf-8', function (err, description) {

      if (queryData.id === undefined) {
        title = "Welcome";
        description = "Hello, Node.js";
      }
      var template = `
                  <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              ${menuList}
            </ol>
            <h2>${title}</h2>
            <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">
            Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
            <img src="coding.jpg" width="100%">
            </p><p style="margin-top:45px;">${description}
            </p>
          </body>
          </html>                  
                  `;
      response.writeHead(200);
      response.end(template);


    });

  } else {
    response.writeHead(400);
    response.end("Not found");
  }



});
app.listen(3000);