const http = require('http');
const fs = require('fs');
const url = require("url");
const qs = require("querystring");
const template = require("../lib/template");
const path = require("path");
const sanitizeHtml = require("sanitize-html");


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
      let title = sanitizeHtml(post.title);
      let description = sanitizeHtml(post.description);
      title = path.parse(title).base;

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
      let id = post.id;
      let title = sanitizeHtml(post.title);
      let description = sanitizeHtml(post.description);


      id = path.parse(id + "").base;
      title = path.parse(title).base;

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
      let id = post.id;
      id = path.parse(id + "").base;

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