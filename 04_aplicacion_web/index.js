const createServer = require("./create_server.js");
var fs = require("fs");
const get = (request, response) => {
  if (request.path === "/") {
    fs.readFile("index.html", function (err, data) {
      if (err) return console.log(err);

      response.send(200, { "Content-Type": "text/html" }, data);
    });
  }
  if (request.path.indexOf("script.js") != -1) {
    fs.readFile("script.js", function (err, data) {
      response.send(200, { "Content-Type": "text/javascript" }, data);
    });
  }

  if (request.path.indexOf(".css") != -1) {
    fs.readFile("styles.css", function (err, data) {
      if (err) console.log(err);

      response.send(200, { "Content-Type": "text/css" }, data);
    });
  }

  if (request.path.indexOf("getScore") != -1) {
    fs.readFile("scores.json", "utf8", function (err, data) {
      console.log(data);
      response.send(200, { "Content-Type": "application/json" }, data);
    });
  }
};

const post = (request, response) => {
  if (request.path.indexOf("postScore") != -1) {
    const score = request.body;
    fs.readFile("scores.json", "utf8", function readFileCallback(err, data) {
      if (err) {
        response.send(
          "500",
          { "Content-Type": "text/html" },
          "<h1>There was a problem saving your score!</h1>"
        );
        return;
      } else {
        obj = JSON.parse(data);

        obj.scores.push(score);

        json = JSON.stringify(obj);
        fs.writeFile("scores.json", json, "utf8", function (err) {
          if (err) {
            response.send(
              "500",
              { "Content-Type": "text/html" },
              "<h1>There was a problem saving your score!</h1>"
            );
            return;
          }
          response.send(
            "200",
            { "Content-Type": "text/html" },
            "<h1>Your score was saved succesfuly!</h1>"
          );
        });
      }
    });
  }
};

const requestListener = (request, response) => {
  switch (request.method) {
    case "GET": {
      return get(request, response);
    }
    case "POST": {
      return post(request, response);
    }
    default: {
      return response.send(
        404,
        { "Content-Type": "text/plain" },
        "The server only supports HTTP methods GET and POST"
      );
    }
  }
};

const server = createServer((request, response) => {
  try {
    return requestListener(request, response);
  } catch (error) {
    console.error(error);
    response.send(500, { "Content-Type": "text/plain" }, "Uncaught error");
  }
});

server.listen(8080);
