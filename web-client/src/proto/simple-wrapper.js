// 簡化的 protobuf 包裝器
// 直接使用 ES6 import 語法並設置必要的全局變數

import * as jspb from 'google-protobuf'
import * as grpcWeb from 'grpc-web'

// 為 protobuf 生成的文件設置全局環境
if (typeof window !== 'undefined') {
  // 設置 global 變數
  window.jspb = jspb
  window.grpc = { web: grpcWeb }
  
  // 設置 require 函數來處理模組依賴
  window.require = function(module) {
    if (module === 'google-protobuf') {
      return jspb;
    }
    if (module === 'grpc-web') {
      return grpcWeb;
    }
    if (module === './helloworld_pb.js') {
      // ./generated/helloworld_pb.js 執行時會通過 goog.object.extend(exports, proto.helloworld)
      // 將其導出內容賦值給 window.exports (因為 simple-wrapper.js 中 window.exports = window.exports || {})
      return window.exports;
    }
    throw new Error(`Module ${module} not found`);
  };
  
  // 設置 module 和 exports 來處理 CommonJS 導出
  window.module = window.module || { exports: {} }
  window.exports = window.exports || {}
}

// 直接執行 protobuf 生成的程式碼
export async function initializeProto() {
  try {
    // 動態載入並執行生成的檔案
    // 確保 window.module 和 window.exports 在 import 前已準備好 (這已在檔案頂部 if (typeof window !== 'undefined') 塊中處理)
    await import('./generated/helloworld_pb.js');
    await import('./generated/helloworld_grpc_web_pb.js');
    
    // helloworld_grpc_web_pb.js 會將完整的 proto.helloworld 賦值給 module.exports
    // 這個 module.exports 應該包含 HelloRequest, HelloReply, GreeterClient
    const pb_services = window.module?.exports;

    if (pb_services && pb_services.HelloRequest && pb_services.GreeterClient && pb_services.HelloReply) {
      const { HelloRequest, HelloReply, GreeterClient } = pb_services;
      console.log('Proto classes successfully extracted from module.exports:', { HelloRequest, HelloReply, GreeterClient });
      return { HelloRequest, HelloReply, GreeterClient };
    }
    
    // 如果主要邏輯失敗，拋出更明確的錯誤
    let missing = [];
    if (!pb_services) {
        missing.push("window.module.exports was not found");
    } else {
        if (!pb_services.HelloRequest) missing.push("HelloRequest from module.exports");
        if (!pb_services.GreeterClient) missing.push("GreeterClient from module.exports");
        if (!pb_services.HelloReply) missing.push("HelloReply from module.exports");
    }
    throw new Error(`Could not find all required proto classes. Missing or unavailable: ${missing.join(', ')}.`);

  } catch (error) {
    // App.vue 中已有 console.error 記錄，此處不再重複，僅重新拋出
    // console.error('Failed to initialize proto in simple-wrapper:', error);
    throw error;
  }
}
