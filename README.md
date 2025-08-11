# hanabi.js

軽量で型安全な静的サイトジェネレーター（SSG）です。小規模サイトに向けたツールとして、TypeScriptとTSX記法を活用した型安全なサイト構築を可能にします。

## 特徴

- **軽量** - 最小限の依存関係と最適化されたビルド
- **型安全** - TypeScriptによる堅牢な型システム
- **TSX記法対応** - React風の構文でコンポーネントを定義
- **Markdownサポート** - Gray Matterによるフロントマター対応
- **ファイルベースルーティング** - ディレクトリ構造に基づいたルーティング
- **開発サーバー** - ホットリロード対応でリアルタイム反映
- **FontAwesome対応** - SVGアイコンの最適化ビルド
- **フルスタック対応** - サーバーサイドとクライアントサイドで統一された作法
- **高速デプロイ** - 効率的なビルドプロセス

## インストール

### Node.js環境

```bash
# Node.js 23推奨
yarn add hanabijs
```

### Nix環境（推奨開発環境）

```bash
# WSL2でNixを使用した開発環境のセットアップ
sh <(curl -L https://nixos.org/nix/install) --no-daemon
mkdir -p ~/.config/nix && echo "experimental-features = nix-command flakes" > ~/.config/nix/nix.conf

git clone https://github.com/osawa-naotaka/hanabijs.git
cd hanabijs
nix develop
```

## 使用方法

### プロジェクトセットアップ

```bash
# 依存関係のインストール
yarn install

# 本番ビルド
yarn build

# 開発サーバー起動
yarn dev

# サイト生成（Node.js）
yarn node-build
```

### 基本的なサイト構造

```
site/
├── pages/           # ページファイル（TSX）
│   ├── index.html.tsx
│   └── posts/
│       └── [slug].html.tsx
├── components/      # 再利用可能なコンポーネント
├── contents/        # Markdownコンテンツ
│   └── posts/
├── public/          # 静的ファイル
└── site.config.ts   # サイト設定
```

### ページの作成例

```tsx
// site/pages/index.html.tsx
import type { HRootPageFn } from "hanabijs/core";

const IndexPage: HRootPageFn<{}> = async () => {
  return (
    <div>
      <h1>Welcome to hanabi.js</h1>
      <p>型安全な静的サイトジェネレーター</p>
    </div>
  );
};

export default IndexPage;
```

### Markdownページの活用

```tsx
// site/pages/posts/[slug].html.tsx
import type { HRootPageFn } from "hanabijs/core";

interface PostPageProps {
  slug: string;
}

const PostPage: HRootPageFn<PostPageProps> = async ({ slug }) => {
  // Markdownファイルからデータを取得
  const post = await loadMarkdown(`site/contents/posts/${slug}.md`);
  
  return (
    <article>
      <h1>{post.data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

export default PostPage;
```

## CLIコマンド

```bash
# ビルド
hanabi build

# 開発サーバー
hanabi dev

# カスタム設定ファイル指定
hanabi build --config custom.config.ts

# ヘルプ表示
hanabi --help

# バージョン確認
hanabi --version
```

## 設定

`site/site.config.ts`でサイトの設定を行います：

```typescript
export const site = {
  lang: "ja",
  name: "My Site",
  description: "サイトの説明",
};

export const posts_dir = "site/contents/posts/";
```

## アーキテクチャ

hanabi.jsは以下の設計原則に基づいています：

- **表現と構造の分離** - コンテンツ、レイアウト、スタイル、挙動の論理的分離
- **型安全なスタイリング** - CSS-in-JSの進化版による型チェック
- **関数型アプローチ** - 純粋関数によるコンポーネント設計
- **リソース最適化** - 使用されるアセットのみを含める自動最適化

### コアコンポーネント

- **Component System** - 仮想DOMを使わない直接HTML生成
- **Routing** - ファイルベースの動的ルーティング（`[param]`記法対応）
- **Markdown Processing** - unified ecosystem（remark/rehype）活用
- **Asset Management** - フォントサブセットとSVG最適化
- **Development Server** - WebSocketベースのホットリロード

## 対応ランタイム

- **Node.js** - メイン対応（v23推奨）
- **Bun** - 高速実行対応
- **Deno** - TypeScript native対応

## ライセンス

MIT License

## 開発・コントリビューション

```bash
# テスト実行
yarn test

# コード整形
yarn check

# パッケージビルド
yarn pack
```

## リポジトリ

- GitHub: [osawa-naotaka/hanabijs](https://github.com/osawa-naotaka/hanabijs)
- Issues: [GitHub Issues](https://github.com/osawa-naotaka/hanabijs/issues)