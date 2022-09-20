const http = require('http');
const fs = require('fs');
const url = require("url");
const qs = require("querystring");

const template = {


  HTML: function (title, menuList, body) {
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
  },

  list: function (filelist) {
    let menuList = "";
    filelist.forEach(item => {
      menuList += `<li><a href="/?id=${item}">${item}</a></li>`;
    })
    return menuList;
  },


  page: function commonPage(queryData, response, head, body) {
    const _this = this;

    fs.readFile(`../data/${queryData.id}`, 'utf-8', function (err, description) {
      let title = queryData.id;
      if (head === "main") {
        if (queryData.id === undefined) {
          title = "Welcome";
          description = "Hello, Node.js";
          body = `<a href="/create">create</a><h2>${title}</h2>${description}`;
        } else {
          body = `<a href="/create">create</a>&nbsp;&nbsp;&nbsp;
              <a href="/update?id=${title}">update</a>&nbsp;&nbsp;&nbsp;              
              <form method="post" action="/delete_proecess">
                <input type="hidden" name="id" value='${title}' >
                <input type="submit" value="delete" style="">
              </form>
              <h2>${title}</h2>${description}`;
        }

      } else if (head === "create") {
        title = "CREATE";

      } else if (head === "update") {
        body = `<form action="/update_process" method="post">
        <p><input type="hidden" name="id" value='${title}' ></p>
        <p><input type="text" name="title" value='${title}'></p>
        <p><textarea name="description" style="width:200px; height:150px" >${description}</textarea></p>
        <p><input type="submit" value="수정하기"></p>
      </form>`;

      }

      const menuList = _this.list(fs.readdirSync('../data'));
      const endTemp = _this.HTML(title, menuList, body);

      response.writeHead(200);
      response.end(endTemp);
    });
  }

}



const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;


  if (pathname === '/') {
    template.page(queryData, response, "main", "");


  } else if (pathname === '/create') {
    template.page(queryData, response, "create", `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder=""></p>
        <p><textarea name="description" style="width:200px; height:150px" ></textarea></p>
        <p><input type="submit"></p>
      </form>`);
  } else if (pathname === '/create_process') {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });

    request.on("end", function (data) {
      const post = qs.parse(body);
      let title = post.title;
      let description = post.description;

      fs.writeFile(`../data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end("success");
      })

    });

  } else if (pathname === '/update') {
    template.page(queryData, response, "update", null);

  } else if (pathname === '/update_process') {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });

    request.on("end", function (data) {
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;

      fs.rename(`../data/${id}`, `../data/${title}`, function (err) {
        fs.writeFile(`../data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end("success");
        })
      })

    });

  } else if (pathname === '/delete_proecess') {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });

    request.on("end", function (data) {
      const post = qs.parse(body);
      const id = post.id;
      fs.unlink(`../data/${id}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end("success");
      });
    });


  } else {
    response.writeHead(400);
    response.end("Not found");
  }

});
app.listen(3000);