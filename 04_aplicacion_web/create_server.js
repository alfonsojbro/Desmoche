
const net = require("net");

const requestParser = (data) => {
  //Separa los datos entre las cabeceras y el contenido del body
  const [requestHeader, ...bodyContent] = data.toString().split("\r\n\r\n");

  //Separa los datos de las cabeceras entre la primera linea y el resto
  const [firstLine, ...otherLines] = requestHeader.split("\n");

  //Obtiene el metodo, el path y la version HTTP de la primera linea
  const [method, path, httpVersion] = firstLine.trim().split(" ");

  //Separa las cabeceras obtenidas en sus partes correspondientes
  const headers = Object.fromEntries(
    otherLines

      .map((line) => line.split(":").map((part) => part.trim()))
      .map(([name, ...rest]) => [name, rest.join(" ")])
  );

  //Obtiene el resultado del body
  var body = bodyContent[0];
  const getHeader = (cabecera) => {
    //obtener la keys de las cabeceras
    keyHeaders = Object.keys(headers);
    //pasar la cabecera que se quiere obtener a minísculas
    cabeceraMinuscula = cabecera.toLowerCase();
    //se recorren todas la cabaceras
    for (let x = 0; x < keyHeaders.length; x++) {
      //pasar todas las cabeceras a minusculas y comparar con la cabecera que ya está en minuscula
      if (keyHeaders[x].toLowerCase() === cabeceraMinuscula) {
        // si coincide devolver el valor en la posición del array de headers
        return headers[keyHeaders[x]];
      }
    }
    //si no está devolver null
    return null;
  };

  const request = {
    method,
    path,
    httpVersion,
    headers,
    body,
    getHeader,
  };

  return request;
};
const createHTTPResponse = (status, cabecera, body, socket) => {
  const codeToReason = (code) => {
    const reasons = {
      200: "Ok",
      404: "Not Found",
      500: "Internal Server Error",
    };
    return reasons[code];
  };

  cabecera["Content-Length"] = body.length;
  cabecera["Date"] = Date.now();
  const keyCabecera = Object.keys(cabecera);
  socket.write(`HTTP/1.1 ${status} ${codeToReason(status)}\r\n`);
  for (let t = 0; t <= keyCabecera.length - 1; t++) {
    socket.write(`${keyCabecera[t]}: ${cabecera[keyCabecera[t]]}\r\n`);
  }
  socket.write("\r\n");
  socket.write(body + "\n");
  socket.end();
};

const createServer = (requestHandler) => {
  //crear servicio
  const server = net.createServer((socket) => {
    let buffer = [];
    socket.on("data", (chunk) => {
      buffer.push(chunk.toString());

      const request = requestParser(buffer.join(""));
      const response = {
        send: (status, cabecera, body) =>
          createHTTPResponse(status, cabecera, body, socket),
      };

      if (
        parseInt(request.getHeader("Content-Length")) === request.body.length ||
        request.method === "GET"
      ) {
        requestHandler(request, response);
      }
    });
  });
  return {
    //escuchar por el puerto que viene por parametro
    listen: (portNumber) => {
      console.log(portNumber);
      server.listen(portNumber);
    },
    //cerrar la conexión
    close: () => {
      server.close();
    },
  };
};
module.exports = createServer;