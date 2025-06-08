// ES6 wrapper for gRPC-Web generated files
// 這個文件提供一個 ES6 接口來訪問 CommonJS 格式的 protobuf 生成文件

export async function loadProtoModules() {
  try {
    // 動態導入 protobuf 生成的模組
    const [pbModule, grpcModule] = await Promise.all([
      import('../../../proto/dist/js/helloworld_pb.js'),
      import('../../../proto/dist/js/helloworld_grpc_web_pb.js')
    ])
    
    // 由於這些是 CommonJS 模組，我們需要從 default 導出中提取
    const pb = pbModule.default || pbModule
    const grpc = grpcModule.default || grpcModule
    
    return {
      HelloRequest: pb.HelloRequest,
      HelloReply: pb.HelloReply,
      GreeterClient: grpc.GreeterClient,
      GreeterPromiseClient: grpc.GreeterPromiseClient
    }
  } catch (error) {
    console.error('Failed to load protobuf modules:', error)
    throw error
  }
}

// 為了向後兼容，也提供單獨的導出函數
export async function getHelloRequest() {
  const modules = await loadProtoModules()
  return modules.HelloRequest
}

export async function getHelloReply() {
  const modules = await loadProtoModules()
  return modules.HelloReply
}

export async function getGreeterClient() {
  const modules = await loadProtoModules()
  return modules.GreeterClient
}
