import * as grpcWeb from 'grpc-web';

import * as helloworld_pb from './helloworld_pb'; // proto import: "helloworld.proto"


export class GreeterClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  sayHello(
    request: helloworld_pb.HelloRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: helloworld_pb.HelloReply) => void
  ): grpcWeb.ClientReadableStream<helloworld_pb.HelloReply>;

}

export class GreeterPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  sayHello(
    request: helloworld_pb.HelloRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<helloworld_pb.HelloReply>;

}

