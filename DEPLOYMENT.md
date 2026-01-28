# Vercel Deployment Guide

このガイドに従って、OSBPPをVercelにデプロイしてください。

## 前提条件

- [x] GitHubアカウント
- [ ] Vercelアカウント（無料）
- [ ] プロジェクトをGitHubにプッシュ済み

## ステップ1: GitHubにプッシュ

```bash
# 変更をコミット
git add .
git commit -m "Prepare for Vercel deployment"

# GitHubリポジトリを作成してプッシュ
git remote add origin https://github.com/YOUR_USERNAME/osbpp.git
git push -u origin main
```

## ステップ2: Vercelアカウント作成

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントで認証

## ステップ3: プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリ一覧から`osbpp`を選択
3. 「Import」をクリック

## ステップ4: Vercel Postgresを作成

1. プロジェクトダッシュボードで「Storage」タブをクリック
2. 「Create Database」→「Postgres」を選択
3. データベース名を入力（例: `osbpp-db`）
4. リージョンを選択（推奨: Tokyo）
5. 「Create」をクリック

## ステップ5: 環境変数を設定

1. 「Settings」タブ→「Environment Variables」をクリック
2. 以下の環境変数を追加:

### AUTH_SECRET
```bash
# ローカルで生成
openssl rand -base64 32
```
生成された値をコピーして、Vercelに追加

### DATABASE_URL
Vercel Postgresの「.env.local」タブから`POSTGRES_PRISMA_URL`の値をコピー

### NEXTAUTH_URL
デプロイ後のURL（例: `https://your-app.vercel.app`）
※最初は空欄でOK、デプロイ後に設定可能

## ステップ6: データベースを初期化

Vercelダッシュボードで:
1. 「Storage」→作成したPostgresデータベースをクリック
2. 「Query」タブを開く
3. または、ローカルで以下を実行:

```bash
# DATABASE_URLを一時的に設定
$env:DATABASE_URL="postgres://..." # Vercelからコピー
npx prisma db push
```

## ステップ7: デプロイ

1. Vercelが自動的にデプロイを開始します
2. デプロイ完了まで待機（通常1-2分）
3. 「Visit」ボタンでサイトを確認

## ステップ8: 動作確認

1. デプロイされたURLにアクセス
2. サインイン機能をテスト
3. ビジネスプランを作成
4. Star/Fork/Discussionをテスト

## トラブルシューティング

### ビルドエラーが発生する場合
- 環境変数が正しく設定されているか確認
- `DATABASE_URL`が`POSTGRES_PRISMA_URL`の値になっているか確認

### データベース接続エラー
- Vercel Postgresが正しく作成されているか確認
- `prisma db push`を実行してスキーマを適用

### 認証エラー
- `AUTH_SECRET`が設定されているか確認
- `NEXTAUTH_URL`がデプロイURLと一致しているか確認

## 今後の更新

コードを更新したら:
```bash
git add .
git commit -m "Update feature"
git push
```

Vercelが自動的に再デプロイします。

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
