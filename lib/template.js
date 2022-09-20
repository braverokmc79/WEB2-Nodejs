const fs = require('fs');
const path = require("path");

module.exports = {

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
        const filteredId = path.parse(queryData.id + "").base;


        fs.readFile(`../data/${filteredId}`, 'utf-8', function (err, description) {
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

