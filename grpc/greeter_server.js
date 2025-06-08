// OpenTelemetry 設定 - 必須在其他模組載入前執行
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { GrpcInstrumentation } = require('@opentelemetry/instrumentation-grpc');
// 正確匯入 TraceExporter (不是 CloudTraceExporter)
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');

// 初始化 Cloud Trace Exporter
const traceExporter = new TraceExporter();

const sdk = new NodeSDK({
  traceExporter: traceExporter, // 直接使用 TraceExporter，NodeSDK 會自動處理批次處理
  instrumentations: [
    getNodeAutoInstrumentations({
      // 停用 fs instrumentation，因為它在某些情況下可能產生過多雜訊
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
    new GrpcInstrumentation(),
  ],
  // 您可以設定 serviceName 來識別您的應用程式
  serviceName: 'greeter-server-otel',
});

// 啟動 OpenTelemetry SDK
try {
  sdk.start();
  console.log('OpenTelemetry SDK started successfully.');
} catch (error) {
  console.error('Error starting OpenTelemetry SDK:', error);
}

// 確保在應用程式關閉時也關閉 SDK
process.on('SIGTERM', () => {
  try {
    sdk.shutdown();
    console.log('OpenTelemetry SDK shut down successfully.');
  } catch (error) {
    console.error('Error shutting down OpenTelemetry SDK:', error);
  } finally {
    process.exit(0);
  }
});

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
