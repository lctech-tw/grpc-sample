// 包裝 protobuf 生成的文件以支援 ES 模組
import protoMessages from '../../proto/dist/js/helloworld_pb.js'
import protoServices from '../../proto/dist/js/helloworld_grpc_web_pb.js'

export const HelloRequest = protoMessages.HelloRequest
export const HelloReply = protoMessages.HelloReply
export const GreeterClient = protoServices.GreeterClient
export const GreeterPromiseClient = protoServices.GreeterPromiseClient
