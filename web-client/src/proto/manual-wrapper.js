// 手動 ES6 包裝器 for protobuf 生成的 CommonJS 文件
import * as grpcWeb from 'grpc-web'
import * as jspb from 'google-protobuf'

// 設置全局變數以供 protobuf 生成的文件使用
window.jspb = jspb
window.grpc = { web: grpcWeb }

let protoClasses = null

export async function loadProtoClasses() {
  if (protoClasses) {
    return protoClasses
  }

  try {
    // 載入 protobuf 訊息類別
    await import('./generated/helloworld_pb.js')
    
    // 載入 gRPC Web 客戶端
    await import('./generated/helloworld_grpc_web_pb.js')

    // 從 global 命名空間中提取類別
    if (window.proto && window.proto.helloworld) {
      protoClasses = {
        HelloRequest: window.proto.helloworld.HelloRequest,
        HelloReply: window.proto.helloworld.HelloReply,
        GreeterClient: window.proto.helloworld.GreeterClient,
        GreeterPromiseClient: window.proto.helloworld.GreeterPromiseClient
      }
      
      console.log('Proto classes loaded successfully:', protoClasses)
      return protoClasses
    } else {
      throw new Error('Proto classes not found in global namespace. Available:', window.proto)
    }
    
  } catch (error) {
    console.error('Failed to load proto classes:', error)
    throw error
  }
}

// 便利函數
export async function getHelloRequest() {
  const classes = await loadProtoClasses()
  return classes.HelloRequest
}

export async function getGreeterClient() {
  const classes = await loadProtoClasses()
  return classes.GreeterClient
}
