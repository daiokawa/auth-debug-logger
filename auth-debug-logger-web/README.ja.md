# Auth Debug Logger Webダッシュボード

Google、Stripe、その他のOAuth/APIサービスからの認証フローを監視するリアルタイムWebダッシュボード。

[English](README.md) | **日本語**

## 機能

- リアルタイムログ監視
- サービス別フィルタリング（Google、Stripe、Twitter、Facebook）
- ステータスコード別フィルタリング
- 検索機能
- ログをJSONとしてエクスポート
- 詳細なリクエスト/レスポンスビューア

## APIエンドポイント

### GET /api/logs
最近の認証ログを取得

クエリパラメータ：
- `limit` - 返すログの数（デフォルト：100）

### POST /api/logs
新しい認証ログエントリを送信

リクエストボディ：AuthLogEntryオブジェクト

## 開発

```bash
npm install
npm run dev
```

## デプロイ

Vercelへデプロイ：

```bash
vercel
```

このアプリはauth-debug-logger CLIツールと連携して動作するように設計されています。

## ポートフォリオエントリー

ahillchan.comにこのプロジェクトを追加するには：

```html
<div class="project">
    <h3>Auth Debug Logger 🔐</h3>
    <p>認証エラーを自動的に監視・分析するClaude Code専用ツール</p>
    <p>Google、Stripe、X等のOAuth/APIエラーをリアルタイムで可視化</p>
    <a href="https://github.com/daiokawa/auth-debug-logger">github.com/daiokawa/auth-debug-logger →</a>
</div>
```