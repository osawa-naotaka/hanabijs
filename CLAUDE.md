# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

**重要**: Claude Codeとのやり取りは**常に日本語で行ってください**。回答、説明、コメント、エラーメッセージなど、全ての出力を日本語で提供してください。

## プロジェクト基本情報

# zephblaze

zephblazeは、軽量で型安全な静的サイトジェネレーター（SSG）です。モダンなWeb開発の手法を取り入れながら、コンポーネントとデザインの再利用性を高めることを目指しています。

## zephblaze ビルド方法

currently, zephblaze is developed using node.js 23.
prepare develop environment with [nix](https://nixos.org/download/) on WSL2:

```shell
sh <(curl -L https://nixos.org/nix/install) --no-daemon
mkdir -p ~/.config/nix && echo "experimental-features = nix-command flakes" > ~/.config/nix/nix.conf
git clone https://github.com/osawa-naotaka/zephblaze.git
cd zephblaze
nix develop
```

for build bundle:

```shell
yarn install
yarn build
```

develop test site:
```shell
yarn install
yarn dev
```

deploy test site:
```shell
yarn install
yarn node-build
```

## Claude Code作業指針

### 言語設定
- **全ての回答・説明を日本語で行う**
- Markdownファイルはすべて日本語で記述
- コードはすべて英語で記述
- エラーメッセージや説明も英語で提供

### ファイル作成・編集方針
- 既存ファイルの編集を優先し、新規作成は最小限に
- コード規約・スタイルは既存コードに合わせる
- セキュリティベストプラクティスの遵守（秘匿情報の保護）

## 脚注
- docディレクトリ内は検討中で、コードと一致していません。無視してください。
