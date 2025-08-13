# Zephblazeのコンポーネント

前述のドキュメントでは、element()関数を使うことにより、html要素に相当する新たな要素を作成することができました。この要素はそのまま1つのhtml要素に対応するため、子要素・孫要素などと組み合わされた、複雑な再利用可能の要素は定義できませんでした。

Zephblazeでは、再利用可能なコンポーネントを作成して、複雑なUIを構築できます。このガイドでは、コンポーネントの基本的な作り方と使い方について説明します。

## コンポーネントの作成

以下に、サイトタイトルを表すコンポーネントの例を示します。このコンポーネントの名前はSiteTitleで、
<SiteTitle>site name</SiteTitle>とすることで、site titleをh1要素の子要素として指定するとともに、
site titleに対し「/」へのリンクを張ります。

```typescript
import { component, element } from "zephblaze/core";
import type { H1Attribute, HComponentFn } from "zephblaze/core";

export function siteTitle(): HComponentFn<Partial<H1Attribute>> {
    const SiteTitle = element("site-title", { tag: "h1" });
    return component(SiteTitle, (_attr, ...child) => (
        <SiteTitle>
            <a href="/">{child}</a>
        </SiteTitle>
    ));
}
```

1. コンポーネント名を決める。Camel Caseを利用することをお勧めする。この例では、SiteTitleというコンポーネント名にした。
2. コンポーネント生成関数を作成する。関数名は何でもよい。1で決めたコンポーネント名の、最初の1文字を小文字にしたものを関数名とすることをお勧めする。この例では、siteTitle()という関数名にした。
3. element()関数を使って、このコンポーネントのTop要素を作成する。Top要素の名前（変数名）は実際は何でもよいが、コンポーネント名にすることをお勧めする。また、この要素のクラス名は何でもよい。前述のドキュメントの勧めに従い、site-titleというクラス名にした。
4. component()関数を使って、名前のついたコンポーネントを作成する。componenet()の第一引数に、作成するコンポーネントのTOP要素を指定する。ここでは、SiteTitleを指定した。第二引数には、コンポーネントの実体の要素を返す関数を指定する。この関数の引数は2個存在する。1個目は属性名とその値をkey-valueとしたObjectが渡される。これは、このコンポーネントを実体化した時に、属性として指定したものが代入される。例えば、<SiteTitle id="hoge">とtsxで実体化した場合、第一引数には{ id: "hoge" }が指定される。2個目の引数はrest引数で、コンポーネントを実体化した場合に、その子要素として指定された要素が指定される。

```typescript
import type { HRootPageFn, Store } from "zephblaze/core";
import { siteTitle } from "../components/siteTitle";

export default function Root(_store: Store): HRootPageFn<void> {
    const SiteTitle = siteTitle();
    
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

1. コンポーネント生成関数を呼び出し、戻り値を変数に格納する。戻り値は関数である。この関数がコンポーネントとなる。変数名はなんでもよいが、コンポーネント名を指定することをお勧めする。ここでは、最初に決めたSiteTitleという変数名にしてある。

2. コンポーネントを代入した変数を利用してコンポーネントを実体化する。ここでは、<SiteTitle>Hello, Zephblaze!</SiteTitle>と記述することで実体化している。

下記は、このtsx記述から生成されるhtml文章である。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Hello, Zephblaze!</title>
        <link href="/index.css" rel="stylesheet"></link>
    </head>
    <body>
        <h1 class="site-title"><a href="/">Hello, Zephblaze!</a></h1>
    </body>
</html>
```


## コンポーネント作成の基本関数

### element()関数

`element()`関数は、独自のHTML要素を定義するための関数です。

#### 関数の引数

```typescript
element<K extends Tag | ZephblazeTag = "div">(
    element_name: string,
    arg?: ElementArg<K>
): HElementFn<K>
```

- **第一引数 `element_name`** (必須)
  - 型: `string`
  - 要素の名前を指定します
  - この名前は自動的にCSSクラス名として要素に追加されます
  - 例: `"share-x"` → `<div class="share-x">` となる

- **第二引数 `arg`** (オプション)
  - 型: `ElementArg<K>`
  - 要素の設定を指定するオブジェクト
  - `{ class?: string | string[], tag?: K }` の形式
  - `class`: 追加のCSSクラス名を指定
  - `tag`: 実際のHTMLタグ名を指定（デフォルトは"div"）

#### 戻り値

- 型: `HElementFn<K>`
- HTML要素を生成する関数を返します
- `(attribute: AttributeOf<K>, ...child: HNode[]) => HNode` の形式

#### 使用例

```typescript
// 基本的な使い方（divタグとして生成）
const Text = element("share-x-text");
// <div class="share-x-text">内容</div> として生成

// 特定のHTMLタグを指定
const DateTime = element("date-time", { tag: "time" });
// <time class="date-time">内容</time> として生成

// 追加のCSSクラスも指定
const Button = element("custom-button", { 
    tag: "button", 
    class: ["btn", "primary"] 
});
// <button class="custom-button btn primary">内容</button> として生成
```

### component()関数

`component()`関数は、再利用可能なコンポーネントを作成するための関数です。

#### 関数の引数

```typescript
component<K, T>(
    name_fn: HComponentFn<K> | string, 
    component_fn: HComponentFn<T>
): HComponentFn<T>
```

- **第一引数 `name_fn`** (必須)
  - 型: `HComponentFn<K> | string`
  - コンポーネントの名前を指定します
  - 文字列の場合: そのままコンポーネント名として使用
  - 関数の場合: その関数の名前をコンポーネント名として使用

- **第二引数 `component_fn`** (必須)
  - 型: `HComponentFn<T>`
  - 実際のコンポーネントの実装を定義する関数
  - `(argument: HComponentFnArg<T>, ...child: HNode[]) => HNode` の形式

#### 戻り値

- 型: `HComponentFn<T>`
- 引数を受け取ってHTML要素を生成するコンポーネント関数を返します

#### 使用例

```typescript
// 文字列でコンポーネント名を指定
export function pageHead(): HComponentFn<PageHeadArgument> {
    return component("head", ({ title, description }) => (
        <head class="page-head">
            <title>{title}</title>
            <meta name="description" content={description} />
        </head>
    ));
}

// element()で作成した要素をベースに使用
export function dateTime(): HComponentFn<DateTimeArgument> {
    const DateTime = element("date-time", { tag: "time" });
    
    // 第一引数にDateTime要素関数を指定
    // これにより、第二引数のコンポーネント実装関数が返すjsx要素のトップ要素（DateTime）の名前が
    // このコンポーネントの名前として使用される
    return component(DateTime, ({ datetime, lang = "en-us" }) => {
        const date = datetime instanceof Date ? datetime : new Date(datetime);
        const date_string = date.toLocaleDateString(lang, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        
        // 戻り値のjsxのトップ要素（DateTime）の名前がコンポーネント名になる
        return <DateTime datetime={date.toISOString()}>{date_string}</DateTime>;
    });
}
```

## 型定義の詳細

### HComponentFn型

```typescript
type HComponentFn<T> = (argument: HComponentFnArg<T>, ...child: HNode[]) => HNode;
```

この型は、コンポーネント関数の形を定義します：

- **引数**:
  - `argument`: コンポーネントに渡される引数（型`T`で定義）
  - `...child`: 子要素の配列（オプション）
- **戻り値**: HTML要素やテキストなどのノード

### HComponentFnArg型

```typescript
type HComponentFnArg<T> = T & { 
    class?: string | string[]; 
    id?: string; 
    children?: any; 
    key?: any 
};
```

コンポーネントの引数は、指定した型`T`に加えて、以下の標準的なHTML属性も含みます：

- `class`: CSSクラス名
- `id`: HTML要素のID
- `children`: 子要素（React風の記法）
- `key`: 一意識別子（リスト要素での使用）

### HArgument型

```typescript
type HArgument = Record<string, unknown>;
```

引数を受け取らないコンポーネントで使用する基本的な引数型です。

## 実践的なコンポーネント例

### 最もシンプルなコンポーネント

```typescript
import { component } from "zephblaze/core";
import type { HComponentFn } from "zephblaze/core";

// 引数の型を定義
export type PageHeadArgument = {
    title: string;
    description: string;
};

// コンポーネントを作成
export function pageHead(): HComponentFn<PageHeadArgument> {
    return component("head", ({ title, description }) => (
        <head class="page-head">
            {/* 基本的なメタデータ */}
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1.0" />
            
            {/* 引数を使ったデータの埋め込み */}
            <title>{title}</title>
            <meta name="description" content={description} />
        </head>
    ));
}
```

### element()を活用したコンポーネント

以下の例では、`element()`関数でZephblaze要素を生成し、それをコンポーネントで使用する方法を示しています。

`element("date-time")`で生成した要素は、要素名"date-time"と一致する`DateTime`変数に代入することを推奨します。これにより記述が明確になり、混乱を避けることができます。

生成された要素は、tsx記法で`<DateTime></DateTime>`のように通常のHTML要素と同じ書き方で使用できます。属性や子要素も通常のHTML要素と同様に指定することが可能です。

```typescript
import { component, element } from "zephblaze/core";
import type { HComponentFn } from "zephblaze/core";

export type DateTimeArgument = {
    datetime: string | Date;
    lang?: string;  // オプショナル引数
};

export function dateTime(): HComponentFn<DateTimeArgument> {
    // "date-time"要素を生成し、要素名に対応するDateTime変数に代入
    // この要素はtimeタグとして出力され、自動的にclass="date-time"が付与される
    const DateTime = element("date-time", { tag: "time" });
    
    // 第一引数にDateTime要素関数を指定することで、
    // 戻り値のjsxのトップ要素であるDateTimeの名前がコンポーネント名となる
    return component(DateTime, ({ datetime, lang = "en-us" }) => {
        // JavaScriptロジックも含められる
        const date = datetime instanceof Date ? datetime : new Date(datetime);
        const date_string = date.toLocaleDateString(lang, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        // DateTime変数をtsxで<DateTime>として使用
        // 属性（datetime）と子要素（date_string）を通常のHTML要素と同様に指定
        return <DateTime datetime={date.toISOString()}>{date_string}</DateTime>;
    });
}
```

### Store引数を使ったコンポーネント

```typescript
import { component, element } from "zephblaze/core";
import type { HComponentFn, HArgument, Store } from "zephblaze/core";

// HArgumentは引数なしの場合に使用
export function hero(store: Store): HComponentFn<HArgument> {
    // 複数の要素を定義
    const Hero = element("hero");
    const HeroText = element("hero-text");

    // 第一引数にHero要素関数を指定することで、
    // 戻り値のjsxのトップ要素であるHeroの名前がコンポーネント名となる
    return component(Hero, () => (
        <Hero>
            <HeroText>
                WELCOME TO <em>MY</em> SITE
            </HeroText>
        </Hero>
    ));
}
```

### 複雑な引数を持つコンポーネント

```typescript
import { component, element } from "zephblaze/core";
import type { HComponentFn } from "zephblaze/core";

// 複雑な引数の型定義
export type ArticleArgument = {
    title: string;
    content: string;
    author: {
        name: string;
        email?: string;
    };
    tags: string[];
    publishedAt: Date;
};

export function article(): HComponentFn<ArticleArgument> {
    const Article = element("article", { tag: "article" });
    const ArticleHeader = element("article-header");
    const ArticleContent = element("article-content");
    const TagList = element("tag-list");

    // 第一引数にArticle要素関数を指定することで、
    // 戻り値のjsxのトップ要素であるArticleの名前がコンポーネント名となる
    return component(Article, ({ title, content, author, tags, publishedAt }) => (
        <Article>
            <ArticleHeader>
                <h1>{title}</h1>
                <p>著者: {author.name}</p>
                <p>公開日: {publishedAt.toLocaleDateString('ja')}</p>
                <TagList>
                    {tags.map(tag => (
                        <span key={tag} class="tag">{tag}</span>
                    ))}
                </TagList>
            </ArticleHeader>
            <ArticleContent>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </ArticleContent>
        </Article>
    ));
}
```

## コンポーネントの使用方法

### ページでの使用例

```tsx
import type { HRootPageFn, Store } from "zephblaze/core";
import { pageHead } from "@site/components/pages/pageHead";
import { hero } from "@site/components/sections/hero";
import { article } from "@site/components/module/article";
import { dateTime } from "@site/components/element/dateTime";

export default function Root(store: Store): HRootPageFn<void> {
    // コンポーネントを初期化
    const PageHead = pageHead();
    const Hero = hero(store);  // Storeが必要な場合
    const Article = article();
    const DateTime = dateTime();
    
    return async () => (
        <html lang="ja">
            {/* コンポーネントを使用（引数を渡す） */}
            <PageHead 
                title="私のブログ - ホーム"
                description="技術について書いているブログです"
            />
            <body>
                <Hero />
                <main>
                    <Article 
                        title="Zephblazeを使ってみた感想"
                        content="<p>とても使いやすいフレームワークでした。</p>"
                        author={{ name: "田中太郎", email: "tanaka@example.com" }}
                        tags={["zephblaze", "typescript", "web開発"]}
                        publishedAt={new Date("2024-01-15")}
                    />
                    
                    <p>最終更新: <DateTime datetime="2024-01-20" lang="ja" /></p>
                </main>
            </body>
        </html>
    );
}
```

## エラーの対処法

### よくあるエラーと解決方法

1. **型エラー**: `Property 'xxx' is missing in type`
   ```typescript
   // ❌ 必須の引数が不足
   <PageHead title="タイトル" />  // descriptionが不足
   
   // ✅ 正しい使用方法
   <PageHead title="タイトル" description="説明文" />
   ```

2. **要素名の重複エラー**
   ```typescript
   // ❌ 同じ名前の要素を複数定義
   const Button1 = element("button");
   const Button2 = element("button");  // 名前が重複
   
   // ✅ 異なる名前を使用
   const PrimaryButton = element("primary-button");
   const SecondaryButton = element("secondary-button");
   ```

3. **コンポーネント初期化忘れ**
   ```typescript
   // ❌ コンポーネントを初期化せずに使用
   const myComponent = pageHead;  // 関数そのもの
   
   // ✅ 正しい初期化
   const PageHead = pageHead();  // 関数を実行してコンポーネントを取得
   ```

## まとめ

Zephblazeのコンポーネントシステムの特徴：

1. **二段階の構成**: `element()`でHTML要素を定義し、`component()`で動作を定義
2. **型安全性**: TypeScriptによる完全な型チェックで開発時エラーを防止
3. **再利用性**: 一度作成したコンポーネントは複数の場所で使用可能
4. **柔軟性**: 単純なものから複雑な引数を持つコンポーネントまで対応
5. **開発体験**: 型推論によるIDEでの自動補完とリファクタリング支援
6. **明確な命名**: `component()`の第一引数で指定した要素関数の名前がコンポーネント名となる

この仕組みを理解することで、保守性が高く、再利用可能なコンポーネントを効率的に作成できるようになります。
