# hanabi.js

currently, hanabi.js is developed using node.js 23.
prepare develop environment with [nix](https://nixos.org/download/) on WSL2:

```shell
sh <(curl -L https://nixos.org/nix/install) --no-daemon
mkdir -p ~/.config/nix && echo "experimental-features = nix-command flakes" > ~/.config/nix/nix.conf
git clone https://github.com/osawa-naotaka/hanabijs.git
cd hanabijs
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
yarn site
```

## コンセプト

**WordPressのように、テーマを後から切り替えられるようにする**

- ウェブページの構成要素をいくつかにカテゴライズして論理的に分離する
  - コンテンツ（文章・画像）
    - jsonで表す。markdownはjsonに変換して操作する
  - hanabiスキーマ
    - main, aside, section, header, footer, h1~6, pなどを使ってjsonを意味づけする
    - 実体はhanabiのComponent？
    - 他の独自のhanabiスキーマを定義できるようにする？
      - divタグで実体を作り、classにより分類できるようにする
      - もしくは本当に独自タグにし、最後のstringify時にdivに変換する
    - hanabiスキーマを型へ。型から自動的にhanabスキーマを生成する
  - レイアウト（縦・横・グリッド・[絶対位置(layout:absolute)](https://github.com/osawa-naotaka/lulliecat-musics/blob/main/index-02-absolute.html)・相対位置(position: relative. 絶対位置の基準用の使い方以外はいらないかも)・固定位置(layout:fixed)）
    - レイアウトコンポーネントを作る？型にする？
    - ボックス（親）とコンテナ（子）の関係を陽にする
      - ボックスはコンテナだけを含む
      - コンテナは1~n個のスキーマ要素を含む
    - 絶対位置と固定位置は通常のレイアウトフローから逸脱するので、親子関係ではない
        - どう実装するか要検討
    - hanabiスキーマの親子関係のある箇所にレイアウトコンポーネントを挿入する
      - stringify時に、省略できるレイアウトコンポーネントは削除する
        - 削除できないものはdiv要素にする
    - ウィンドウ幅などによるレイアウトの変化
      - CSSのメディアクエリを使うもの
      - JavaScriptで変更するもの
  - 装飾（フォント・色・輪郭・アイコン？）
    - スキーマ要素に装飾を割り当てる
    - メインカラー、アクセントカラー、フォントサイズ、ボーダースタイルなどを指定すると、自動的に名前付きの色や各種変数を複数生成する
      - main, accent, main-dark, main-light, accent-dark, accent-light
      - border-thin, border-thick, border-round, border-sharp, shadow-xxx
      - これらを明示的に値で指定もでき、また、テーマとしてセットで提供・入れ替える仕組みも入れる
    - hanabiスキーマに装飾を割り当てる
      - どうやって割り当てるかは未定

  - アニメーション
  - スクリプト
    - イベントとその応答
    - 状態（jsonなど）と、それに結びついた自動レンダリング（json配列をli要素展開し、元の状態が変更したら自動的に再レンダリング）
    - その他動的な要素


