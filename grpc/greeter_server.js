const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  __dirname + "/helloworld.proto",
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const { Greeter } = grpc.loadPackageDefinition(packageDefinition).helloworld;

const server = new grpc.Server();

server.addService(Greeter.service, {
  sayHello: (call, callback) => {
    console.log("Received request:", call.request.name);
    callback(null, { message: `Hello ${call.request.name}` });
  },
});

const port = process.env.PORT || "50051";

server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server running on port 50051");
  }
);
