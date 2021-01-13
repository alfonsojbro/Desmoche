const createServer = require("./create_server.js");
var fs = require('fs');
const get = (request, response) => {

  console.log("Main", request.path)


  if(request.path === '/' != -1){
    fs.readFile('index.html', function(err, data){
      if(err) return console.log(err);
      

      response.send(200, { "Content-Type": "text/html" }, data);
    });
  }
  

  if(request.path.indexOf('.js') != -1){

    fs.readFile('script.js', function (err, data) {
        response.send(200, {'Content-Type': 'text/javascript'}, data);
    });
  }


  if(request.path.indexOf('.css') != -1){
      fs.readFile('styles.css', function (err, data) {
        if (err) console.log(err);
    
        response.send(200, {'Content-Type': 'text/css'}, data);
        
      });
    }
};

const post = (request, response) => {
  // ...📝

  response.send(
    "200"
    // ...,
    // ...
  );
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
