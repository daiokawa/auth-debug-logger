# Auth Debug Logger 🔐

Google、Stripe、X（Twitter）などのOAuth/APIサービスの認証フローをデバッグするための汎用ツール。もう開発者コンソールを開く必要はありません！

[English](README.md) | **日本語**

## 🚀 クイックデプロイ（誰でも使える！）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/daiokawa/auth-debug-logger&project-name=my-auth-debug-logger&repository-name=my-auth-debug-logger)

上のボタンをクリックして、30秒で自分専用のインスタンスをデプロイ！

## 主な機能

- 🔍 **自動リクエスト監視**: 認証関連のHTTPトラフィックをすべてキャプチャ
- 📊 **リアルタイムWebダッシュボード**: 美しいUIで認証フローをリアルタイム監視
- 📝 **包括的なロギング**: すべての認証リクエスト/レスポンスをディスクに保存
- 🏷️ **スマートタグ付け**: Google、Stripe、OAuthフローを自動識別
- 🎯 **ゼロ設定**: デフォルト設定ですぐに使える
- 🚀 **軽量**: アプリケーションへの影響を最小限に

## インストールオプション

### オプション1: 共有インスタンスを使う（最も簡単）
```bash
export AUTH_DEBUG_LOGGER_URL="https://auth-debug-logger-1750698056-jva4rhh3e-daiokawas-projects.vercel.app"
```

### オプション2: 自分専用をデプロイ（推奨）
上のデプロイボタンをクリックするか、以下のURLにアクセス：
https://vercel.com/new/clone?repository-url=https://github.com/daiokawa/auth-debug-logger

### オプション3: ローカルインストール
```bash
# クローンしてローカルで実行
git clone https://github.com/daiokawa/auth-debug-logger.git
cd auth-debug-logger/auth-debug-logger-web
npm install
npm run dev
```

## クイックスタート

### 1. プロキシを起動
```bash
adl start
# または
auth-debug-logger start
```

### 2. アプリケーションでプロキシを設定
```bash
export HTTP_PROXY=http://localhost:8888
export HTTPS_PROXY=http://localhost:8888
```

### 3. ダッシュボードを開く
<http://localhost:3333>

### 4. アプリケーションを実行して認証ログを確認！

## 使用例

### Node.jsアプリケーション
```javascript
// リクエスト前にプロキシを設定
process.env.HTTP_PROXY = 'http://localhost:8888';
process.env.HTTPS_PROXY = 'http://localhost:8888';

// 認証コードは通常通り動作
const stripe = new Stripe(process.env.STRIPE_KEY);
const charge = await stripe.charges.create({...});
```

### Pythonアプリケーション
```python
import os
os.environ['HTTP_PROXY'] = 'http://localhost:8888'
os.environ['HTTPS_PROXY'] = 'http://localhost:8888'

# 認証コード
import stripe
stripe.api_key = os.getenv('STRIPE_KEY')
```

### Dockerでの使用
```dockerfile
ENV HTTP_PROXY=http://host.docker.internal:8888
ENV HTTPS_PROXY=http://host.docker.internal:8888
```

## CLIコマンド

```bash
# カスタムポートで起動
adl start --proxy-port 9999 --web-port 4444

# 設定ファイルを初期化
adl init

# ターミナルで最近のログを表示
adl logs -n 50

# リアルタイムでログを追跡
adl logs -f
```

## 設定

プロジェクトに`.env`ファイルを作成：

```env
# プロキシ設定
PROXY_PORT=8888
WEB_UI_PORT=3333

# ロギング
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# 監視対象サービス（カンマ区切り）
MONITORED_HOSTS=accounts.google.com,api.stripe.com,api.twitter.com,graph.facebook.com

# 認証パターン
AUTH_ENDPOINTS=/oauth,/auth,/token,/login,/signin,/signup

# UI設定
AUTO_OPEN_BROWSER=true
```

## ダッシュボード機能

- **リアルタイム更新**: リクエストが発生すると即座に表示
- **フィルタリング**: サービス（Google、Stripeなど）やステータスコードでフィルタ
- **検索**: リクエスト/レスポンスボディを検索
- **エクスポート**: ログをJSONとしてダウンロードして詳細分析
- **詳細ビュー**: 任意のリクエストをクリックして完全な詳細を表示

## ログファイル

ログは`./logs`ディレクトリに保存されます：
- `auth-YYYY-MM-DD.json`: JSON形式の日次認証ログ
- `auth-debug.log`: 一般的なアプリケーションログ
- `error.log`: エラーログのみ

## サポートされているサービス

標準で監視対象：
- Google OAuth / Google APIs
- Stripe API
- Twitter/X API
- Facebook Graph API
- あらゆるOAuth 2.0フロー
- 認証パターンに一致するエンドポイント

## 🔒 セキュリティとプライバシー

### ✅ 安全な点
- **APIキー不要** - すぐに動作
- **永続的な保存なし** - ログは一時的（メモリのみ）
- **HTTPS暗号化** - すべての通信は安全
- **オープンソース** - コードを自分で監査可能

### ⚠️ ベストプラクティス
- **本番の秘密情報を送らない** - ログ記録前に機密データをサニタイズ
- **開発専用** - 本番環境では使用しない
- **プライベートインスタンス推奨** - 機密性の高いデバッグには自分専用をデプロイ

### データの扱い
- Vercelデプロイ: 一時メモリにのみログを保存
- ローカルデプロイ: `/tmp`ディレクトリにログを保存
- データベースや永続的なストレージなし
- 再起動時にログはクリア

## トラブルシューティング

### プロキシがリクエストを傍受しない
- `HTTP_PROXY`と`HTTPS_PROXY`が設定されていることを確認
- 一部のライブラリはプロキシ設定を無視します - ドキュメントを確認してください

### ダッシュボードが更新されない
- ブラウザコンソールでWebSocket接続を確認
- ポート8888と3333が使用されていないことを確認

### 権限エラー
- グローバルnpmインストールには必要に応じて`sudo`を使用
- ログディレクトリの書き込み権限を確認

## 誰が使える？

- **個人開発者**: 自分のプロジェクトのデバッグに最適
- **開発チーム**: 各メンバーが自分のインスタンスをデプロイ可能
- **オープンソースプロジェクト**: 自由に使用・改変可能
- **商用プロジェクト**: はい、MITライセンスです！

## ライセンス

MITライセンス - 自由にプロジェクトで使用してください！

## 貢献者

[@daiokawa](https://github.com/daiokawa)が開発者コミュニティのために作成しました。