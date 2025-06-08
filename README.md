# gRPC Web + Vue 3 範例

這是一個完整的 gRPC Web 與 Vue 3 整合範例，展示如何在瀏覽器中使用 gRPC 服務。

## 📁 專案結構

```tree
├── grpc/                    # gRPC 伺服器
│   ├── greeter_server.js   # Node.js gRPC 伺服器
│   ├── greeter_client.js   # Node.js gRPC 客戶端
│   └── package.json
├── proto/                   # Protocol Buffers 定義
│   ├── helloworld.proto    # 服務定義
│   ├── buf.gen.yaml        # Buf 生成配置
│   └── buf.yaml            # Buf 配置
├── web-client/             # Vue 3 Web 客戶端
│   ├── src/
│   │   ├── App.vue         # 主要 Vue 組件
│   │   ├── main.js         # Vue 應用入口
│   │   └── proto/          # 生成的 JS gRPC 文件
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── envoy.yaml              # Envoy 代理配置
└── docker-compose.yml      # Docker Compose 配置
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
# 安裝 gRPC 伺服器依賴
cd grpc
npm install

# 安裝 Vue 3 客戶端依賴
cd ../web-client
npm install

# 回到根目錄
cd ..
```

### 2. 生成 Protocol Buffers

確保已安裝 [Buf CLI](https://docs.buf.build/installation)：

```bash
# 安裝 Buf (macOS)
brew install bufbuild/buf/buf

# 生成 JavaScript gRPC 文件
cd proto
buf generate
```

### 3. 啟動服務

#### 方法 1: 使用 Docker (推薦)

```bash
# 啟動 Envoy 代理
docker-compose up -d

# 在另一個終端中啟動 gRPC 伺服器
cd grpc
node greeter_server.js

# 在第三個終端中啟動 Vue 3 客戶端
cd web-client
npm run dev
```

#### 方法 2: 手動安裝 Envoy

如果您不想使用 Docker，可以手動安裝 Envoy：

```bash
# macOS
brew install envoy

# 啟動 Envoy 代理
envoy -c envoy.yaml
```

### 4. 測試應用

1. 打開瀏覽器訪問 `http://localhost:3000`
2. 在輸入框中輸入您的姓名
3. 點擊「發送問候」按鈕
4. 查看從 gRPC 伺服器返回的回應

## 🛠️ 技術棧

- **前端**: Vue 3 + Vite + gRPC-Web
- **後端**: Node.js + @grpc/grpc-js
- **代理**: Envoy Proxy (用於 gRPC-Web 轉換)
- **Protocol Buffers**: Buf CLI

## 📋 服務端點

- **gRPC 伺服器**: `localhost:50051`
- **Envoy 代理**: `localhost:8080` (HTTP/1.1 到 gRPC 轉換)
- **Vue 3 客戶端**: `localhost:3000`
- **Envoy 管理界面**: `localhost:9901`

## 🔧 開發說明

### Protocol Buffers 修改

如果您修改了 `proto/helloworld.proto` 文件：

1. 重新生成代碼：
   ```bash
   cd proto
   buf generate
   ```

2. 重啟相關服務

### 添加新的 gRPC 方法

1. 在 `helloworld.proto` 中定義新的 RPC 方法
2. 更新 `greeter_server.js` 實現新方法
3. 重新生成 Protocol Buffers
4. 在 Vue 組件中調用新方法

## 🐛 疑難排解

### 常見問題

1. **CORS 錯誤**: 確保 Envoy 代理正在運行且配置正確
2. **連接被拒絕**: 檢查 gRPC 伺服器是否在 50051 端口運行
3. **找不到 proto 文件**: 確保已經運行 `buf generate` 生成 JavaScript 文件

### 查看日誌

```bash
# gRPC 伺服器日誌
cd grpc && node greeter_server.js

# Envoy 代理日誌
docker-compose logs envoy

# Vue 開發伺服器日誌
cd web-client && npm run dev
```

## 📚 參考資源

- [gRPC-Web 官方文檔](https://github.com/grpc/grpc-web)
- [Vue 3 官方文檔](https://vuejs.org/)
- [Envoy Proxy 文檔](https://www.envoyproxy.io/docs)
- [Protocol Buffers 文檔](https://developers.google.com/protocol-buffers)

## 📄 授權

MIT License
