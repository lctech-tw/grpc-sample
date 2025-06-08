const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  __dirname + "/../proto/helloworld.proto",
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const { Greeter } = grpc.loadPackageDefinition(packageDefinition).helloworld;

const client = new Greeter(
  // 本地開發環境的範例

  // "localhost:50051",
  // grpc.credentials.createInsecure()
  
  // cloud run 的範例
  
  "grpc-service-112614625973.asia-east1.run.app",
  grpc.credentials.createSsl()

  // gclb 的範例
  // "test.jkf.tips",
  // grpc.credentials.createSsl()
);

// 設定連接超時和重試選項
const options = {
  "grpc.keepalive_time_ms": 30000,
  "grpc.keepalive_timeout_ms": 5000,
  "grpc.keepalive_permit_without_calls": true,
  "grpc.http2.max_pings_without_data": 0,
  "grpc.http2.min_time_between_pings_ms": 10000,
  "grpc.http2.min_ping_interval_without_data_ms": 300000,
};

// 檢查服務連接狀態
client.waitForReady(Date.now() + 1000, (error) => {
  if (error) {
    console.error("連接失敗:", error.message);
    console.error("請檢查 Cloud Run 服務是否正在運行");
    return;
  }

  console.log("成功連接到 gRPC 服務");

  const name = process.argv[2] || "local_client";

  // 設定請求超時
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 30);

  client.sayHello({ name }, { deadline }, (err, response) => {
    if (err) {
      console.error("gRPC 調用錯誤:");
      console.error("- 錯誤代碼:", err.code);
      console.error("- 錯誤訊息:", err.details);
      console.error("- 完整錯誤:", err);
      return;
    }
    console.log("收到回應:", response.message);
  });
});
