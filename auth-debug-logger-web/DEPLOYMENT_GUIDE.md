# Auth Debug Logger - みんなが使うための導入ガイド

## 🚀 3つの使い方

### 1. 共有インスタンスを使う（最も簡単）
現在稼働中のインスタンスを共有で使用：
```bash
export AUTH_DEBUG_LOGGER_URL="https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app"
```

**メリット**:
- セットアップ不要
- すぐに使える
- 無料

**注意点**:
- ログは共有される（機密情報は送らない）
- 一時的なデバッグ用途に最適

### 2. 自分専用のインスタンスをデプロイ（推奨）

#### Vercelで無料デプロイ（3クリック）
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/daiokawa/auth-debug-logger&project-name=my-auth-debug-logger&repository-name=my-auth-debug-logger)

1. 上のボタンをクリック
2. GitHubアカウントでログイン
3. "Deploy"をクリック

**メリット**:
- 完全にプライベート
- 無料（Vercelの無料枠内）
- カスタマイズ可能

### 3. ローカルで実行

```bash
# クローン
git clone https://github.com/daiokawa/auth-debug-logger.git
cd auth-debug-logger/auth-debug-logger-web

# インストール
npm install

# 起動
npm run dev
```

アクセス: http://localhost:3000

**メリット**:
- 完全にローカル
- ネットワーク外に出ない
- 開発環境に最適

## 🔒 セキュリティについて

### ✅ 安全な点

1. **APIキーは不要**
   - 認証システムなし
   - APIキー管理不要
   - すぐに使える

2. **データの保存**
   - Vercel版: 一時メモリのみ（再起動で消去）
   - ローカル版: `/tmp`ディレクトリ（再起動で消去）
   - 永続的な保存なし

3. **暗号化**
   - HTTPS通信
   - Vercelの標準セキュリティ

### ⚠️ 注意すべき点

1. **機密情報を送らない**
   ```javascript
   // ❌ 悪い例
   auth_log("POST", "api.stripe.com", 401, "sk_live_actual_secret_key")
   
   // ✅ 良い例
   auth_log("POST", "api.stripe.com", 401, "Invalid API key format")
   ```

2. **本番環境では使わない**
   - 開発・デバッグ専用
   - 本番のトークンは送信しない

3. **共有インスタンスの場合**
   - 他の人もログを見れる可能性
   - テストデータのみ使用

## 🛡️ より安全に使うための設定

### 1. 環境変数でフィルタリング
```bash
# 特定のエラーのみ送信
export AUTH_DEBUG_FILTER="401,403,500"
```

### 2. データのサニタイズ
```javascript
// utils/sanitize.js
function sanitizeAuthError(error) {
  // 機密情報を除去
  return {
    ...error,
    headers: {
      ...error.headers,
      authorization: error.headers.authorization ? '[REDACTED]' : undefined
    },
    body: typeof error.body === 'string' 
      ? error.body.replace(/sk_\w+/g, '[SECRET_KEY]')
      : error.body
  };
}
```

### 3. プライベートネットワーク内で使用
```bash
# Docker Composeの例
version: '3'
services:
  auth-debug-logger:
    image: node:18
    working_dir: /app
    volumes:
      - ./auth-debug-logger:/app
    ports:
      - "127.0.0.1:3000:3000"  # ローカルホストのみ
    command: npm run dev
```

## 🌟 推奨される使い方

### 開発チーム向け
1. 各開発者が自分のVercelインスタンスをデプロイ
2. チーム共有のインスタンスも1つ用意
3. 本番デバッグ時は一時的に使用して即削除

### 個人開発者向け
1. ローカルで起動して使用
2. または自分専用のVercelインスタンス
3. 共有インスタンスはテスト用

### CI/CD環境
```yaml
# GitHub Actions の例
- name: Start Auth Debug Logger
  run: |
    npx auth-debug-logger start &
    echo "AUTH_DEBUG_LOGGER_URL=http://localhost:8888" >> $GITHUB_ENV
```

## 📊 使用制限

### Vercel無料プラン
- 100GB/月の帯域幅
- 100時間/月のビルド時間
- 通常の使用では十分

### ローカル版
- 制限なし
- マシンのリソース次第

## 🎯 まとめ

**最も安全**: ローカル実行
**最もバランスが良い**: 自分専用のVercelインスタンス
**最も手軽**: 共有インスタンス（テストのみ）

機密情報を扱わない限り、セキュリティリスクは最小限です！