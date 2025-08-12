# zephblaze

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

## アーキテクチャ

zephblaze.jsは以下の設計原則に基づいています：

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

- **Node.js** - メイン対応（v24環境で設計検証）
- **Bun** - 高速実行対応
- **Deno** - TypeScript native対応

## ライセンス

MIT License
