# zephblazeのエレメント

前述のように.html.tsxファイルをzephblazeで処理することにより、html文章を生成することができます。
.html.tsxファイルにはデフォルトエクスポートされた関数が定義され、その関数を呼ぶことによりhtmlノードを生成し、それをテキストにシリアライズしてhtml文章に変換します。

.html.tsxファイルでデフォルトエクスポートされた関数が出力するhtmlノードは、基本的にtsx記法で書かれます。
最もシンプルな.html.tsxファイルでは、html要素のみを使ったhtmlノードを定義します。
一方、zephblazeでは、html要素には存在しない、新たな要素を作成することができます。新たな要素は、既存のhtml要素と、その要素の属性として指定されたclass名により区別されます。

以下に、サイトのタイトルを表すSiteTitleという要素を作成する例を示します。

```typescript
import type { HRootPageFn, Store } from "zephblaze/core";
import { element } from "zephblaze/core";

export default function Root(_store: Store): HRootPageFn<void> {
    const SiteTitle = element("site-title", { tag: "h1" });
    return async () => (
        <html lang="en">
            <head>
                <title>Hello, Zephblaze!</title>
            </head>
            <body>
                <SiteTitle>Hello, Zephblaze!</SiteTitle>
            </body>
        </html>
    );
}
```

新たな要素は、element()関数により生成されます。element()関数の第一引数に、作成する要素の名前（クラス名になります）を指定します。第二引数のtagプロパティには、新しく作る要素が生成するhtmlタグを指定します。tagプロパティの指定がない場合はdivタグが利用されます。

element()の戻り値を変数に入れ、その変数をtsx表記の中で使うことにより、今回生成した新たな要素をhtml文章へ実体化できます。このサンプルの例では、以下のようなhtml文章が生成されます。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Hello, Zephblaze!</title>
        <link href="/index.css" rel="stylesheet"></link>
    </head>
    <body>
        <h1 class="site-title">Hello, Zephblaze!</h1>
    </body>
</html>
```

ご覧のように、前回のドキュメントで生成したhtml文章とほぼ同じものが生成されます。
それでは、zephblazeで新たな要素を定義する理由はなんでしょうか？

まず、新たな要素を定義することにより、その要素により詳細な意味を与えることが可能になります。
たとえば、h1要素は、「ページの最上位の見出し」を意味するセマンティック要素です。
これだけでも意味としては十分なのですが、さらに詳細に、「webサイトのタイトル」を意味する要素を定義することにより、より詳細な意図をtsx記述から読み取ることができ、tsx文章の理解につながります。

また、CSSによる修飾のためにも便利に使うことができます。webサイトを通じて、全てのh1要素に同じスタイルを適用するのではなく、webサイトのサイトタイトルにだけスタイルを適用することができます。これは、単純に、要素名として指定された文字列がclass属性として設定されるため、classセレクタを用いてデザインを変更することができます。

```css
.site-titme { font-size: 2rem; }
```

もちろん、単純に毎回h1要素のクラス属性を指定することでも同じことができます。しかし、element()関数を使ったほうが、より「新しい要素を作る」という意図がわかりやすくなります。


