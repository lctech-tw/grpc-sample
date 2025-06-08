<template>
    <div class="app">
        <div class="container">
            <h1 class="title">🚀 gRPC Web + Vue 3 示例</h1>
            <div class="card">
                <div class="input-group">
                    <label for="server">伺服器地址：</label>
                    <input id="server" v-model="serverhost" type="text" placeholder="輸入伺服器地址..." />
                </div>
                <div class="input-group">
                    <label for="name">請輸入您的姓名：</label>
                    <input id="name" v-model="name" type="text" placeholder="輸入姓名..." @keyup.enter="sendGreeting"
                        :disabled="loading" />
                </div>

                <button @click="sendGreeting" :disabled="loading || !name.trim()" class="btn-primary">
                    <span v-if="loading">傳送中...</span>
                    <span v-else>發送問候 👋</span>
                </button>

                <div v-if="response" class="response success">
                    <h3>伺服器回應：</h3>
                    <p>{{ response }}</p>
                </div>

                <div v-if="error" class="response error">
                    <h3>錯誤：</h3>
                    <p>{{ error }}</p>
                    <small>請確保 gRPC 伺服器正在運行並且已啟用 gRPC-Web 代理</small>
                </div>
            </div>

            <div class="info-card">
                <h3>📋 使用說明</h3>
                <ul>
                    <li>確保 gRPC 伺服器正在運行 (port 50051)</li>
                    <li>啟動 Envoy 代理以支援 gRPC-Web</li>
                    <li>輸入姓名並點擊發送問候按鈕</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { initializeProto } from './proto/simple-wrapper.js'

export default {
    name: 'App',
    setup() {
        const name = ref('')
        const response = ref('')
        const error = ref('')
        const loading = ref(false)
        const serverhost = ref('http://localhost:8080')
        let GreeterClient = null
        let HelloRequest = null

        // 在組件掛載時載入 protobuf 模組
        onMounted(async () => {
            try {
                const classes = await initializeProto()
                GreeterClient = classes.GreeterClient
                HelloRequest = classes.HelloRequest
                
                console.log('Protobuf classes loaded successfully:', { GreeterClient, HelloRequest })
                
                if (!HelloRequest || !GreeterClient) {
                    throw new Error('Failed to extract classes from protobuf modules')
                }
            } catch (err) {
                console.error('Failed to load protobuf classes:', err)
                error.value = '無法載入 protobuf 模組: ' + err.message
            }
        })

        const sendGreeting = async () => {
            if (!name.value.trim()) return
            
            if (!GreeterClient || !HelloRequest) {
                error.value = 'protobuf 模組尚未載入，請稍等...'
                return
            }

            loading.value = true
            error.value = ''
            response.value = ''

            try {
                const client = new GreeterClient(serverhost.value, null, null)
                const request = new HelloRequest()
                request.setName(name.value)

                // 使用 Promise 包裝 gRPC 調用
                const reply = await new Promise((resolve, reject) => {
                    client.sayHello(request, {}, (err, response) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(response)
                        }
                    })
                })

                response.value = reply.getMessage()
            } catch (err) {
                console.error('gRPC 錯誤:', err)
                error.value = `連接失敗: ${err.message || '未知錯誤'}`
            } finally {
                loading.value = false
            }
        }

        return {
            name,
            response,
            error,
            loading,
            serverhost,
            sendGreeting
        }
    }
}
</script>

<style scoped>
.app {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    max-width: 600px;
    width: 100%;
}

.title {
    text-align: center;
    color: white;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    margin-bottom: 1.5rem;
}

.card h2 {
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
}

.input-group {
    margin-bottom: 1.5rem;
}

.input-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
}

.input-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
    box-sizing: border-box;
}

.input-group input:focus {
    outline: none;
    border-color: #667eea;
}

.btn-primary {
    width: 100%;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.response {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
}

.response.success {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
}

.response.error {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}

.response h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
}

.response p {
    margin-bottom: 0;
    font-weight: 500;
}

.response small {
    display: block;
    margin-top: 0.5rem;
    opacity: 0.8;
}

.info-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
    color: #333;
    margin-bottom: 1rem;
}

.info-card ul {
    color: #555;
    padding-left: 1.2rem;
}

.info-card li {
    margin-bottom: 0.5rem;
}
</style>
