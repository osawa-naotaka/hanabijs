# Zephblazeのコンポーネント

前章では、`element()`関数を使って単一のHTML要素にクラス名を付与した独自要素の作成方法を学びました。しかし、実際のWebアプリケーションでは、複数の要素を組み合わせた再利用可能なUIパーツが必要です。

このガイドでは、Zephblazeの`component()`関数を使って、複雑な構造を持つ再利用可能なコンポーネントを作成する方法を説明します。

## コンポーネントとは？

**コンポーネント**は、複数のHTML要素を組み合わせて、再利用可能な機能的なUIパーツを作る仕組みです。単一要素では表現できない複雑な構造やロジックを封じ込めます。

### コンポーネントの特徴
- 複数のHTML要素を組み合わせた構造
- 引数を受け取って動的なコンテンツを生成
- コードの再利用性と保守性の向上
- TSX内で独自要素と同じように使用可能

## 基本的なコンポーネントの作成

以下は、サイトタイトルを表示し、ホームページへのリンク機能を持つ`SiteTitle`コンポーネントの例です：

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

### コードの解説

#### 1. コンポーネント生成関数の定義
```typescript
export function siteTitle(): HComponentFn<Partial<H1Attribute>>
```
- **関数名**: キャメルケースで小文字始まり（`siteTitle`）
- **戻り値の型**: `HComponentFn<Partial<H1Attribute>>` - h1要素の属性を受け取るコンポーネント

#### 2. ルート要素の作成
```typescript
const SiteTitle = element("site-title", { tag: "h1" });
```
- `element()`でコンポーネントのルートとなる要素を作成
- クラス名は`"site-title"`、HTMLタグは`h1`を指定

#### 3. コンポーネントの実装
```typescript
return component(SiteTitle, (_attr, ...child) => (
    <SiteTitle>
        <a href="/">{child}</a>
    </SiteTitle>
));
```
- **第一引数**: ルート要素（`SiteTitle`）
- **第二引数**: コンポーネントの実装関数
  - `_attr`: コンポーネントに渡された属性（この例では未使用）
  - `...child`: コンポーネントの子要素（テキストや他の要素）

## コンポーネントの使用

作成したコンポーネントをページで使用する例です：

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

### 使用手順

1. **インポート**: コンポーネント生成関数をインポート
2. **コンポーネントの初期化**: `const SiteTitle = siteTitle();`でコンポーネントを初期化
3. **TSXでの使用**: `<SiteTitle>テキスト</SiteTitle>`として使用

### 生成されるHTML

上記のTSXコードは以下のHTMLを生成します：

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

## 高度なコンポーネントの例

### 属性を活用したコンポーネント

以下は、日付を表示するコンポーネントの例です：

```typescript
import { component, element } from "zephblaze/core";
import type { HComponentFn } from "zephblaze/core";

// コンポーネントの引数の型定義
export type DateTimeArgument = {
    datetime: string | Date;
    lang?: string;
};

export function dateTime(): HComponentFn<DateTimeArgument> {
    const DateTime = element("date-time", { tag: "time" });
    
    return component(DateTime, ({ datetime, lang = "ja" }) => {
        const date = datetime instanceof Date ? datetime : new Date(datetime);
        const dateString = date.toLocaleDateString(lang, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return (
            <DateTime datetime={date.toISOString()}>
                {dateString}
            </DateTime>
        );
    });
}
```

### 複雑な構造を持つコンポーネント

以下は、ブログ記事のカードコンポーネントの例です：

```typescript
import { component, element } from "zephblaze/core";
import type { HComponentFn } from "zephblaze/core";
import { dateTime } from "./dateTime";

export type ArticleCardArgument = {
    title: string;
    description: string;
    publishDate: Date;
    slug: string;
    tags?: string[];
};

export function articleCard(): HComponentFn<ArticleCardArgument> {
    const Card = element("article-card", { tag: "article" });
    const CardHeader = element("card-header", { tag: "header" });
    const CardTitle = element("card-title", { tag: "h3" });
    const CardMeta = element("card-meta");
    const CardDescription = element("card-description", { tag: "p" });
    const TagList = element("tag-list", { tag: "ul" });
    const TagItem = element("tag-item", { tag: "li" });
    
    const DateTime = dateTime();
    
    return component(Card, ({ title, description, publishDate, slug, tags }) => (
        <Card>
            <CardHeader>
                <CardTitle>
                    <a href={`/posts/${slug}.html`}>{title}</a>
                </CardTitle>
                <CardMeta>
                    <DateTime datetime={publishDate} />
                </CardMeta>
            </CardHeader>
            
            <CardDescription>{description}</CardDescription>
            
            {tags && tags.length > 0 && (
                <TagList>
                    {tags.map(tag => (
                        <TagItem key={tag}>
                            <a href={`/tags/${tag}.html`}>#{tag}</a>
                        </TagItem>
                    ))}
                </TagList>
            )}
        </Card>
    ));
}
```

## コンポーネント作成のベストプラクティス

### 1. ファイル組織
```
components/
├── element/          # 単一要素コンポーネント
│   ├── button.tsx
│   └── dateTime.tsx
├── module/           # 複雑な機能コンポーネント
│   ├── articleCard.tsx
│   └── navigation.tsx
└── pages/            # ページレベルコンポーネント
    └── pageHead.tsx
```

### 2. 命名規則
- **ファイル名**: キャメルケースで小文字始まり（`articleCard.tsx`）
- **関数名**: ファイル名と同じ（`function articleCard()`）
- **コンポーネント変数名**: パスカルケース（`const ArticleCard = articleCard()`）
- **型名**: パスカルケース + `Argument`接尾辞（`ArticleCardArgument`）

### 3. 型安全性
- コンポーネントの引数には必ず型を定義
- `Partial<>`を使用してオプショナルな属性を表現
- 既存のHTML属性型（`H1Attribute`等）を活用

### 4. 再利用性
- 単一責任原則: 一つのコンポーネントは一つの機能に集中
- プロパティでカスタマイズ可能な設計
- コンポーネントの組み合わせで複雑なUIを構築

## `component()`関数の詳細

### 基本的な構文

```typescript
component<K, T>(
    rootElement: HElementFn<K> | string, 
    implementation: ComponentImplementation<T>
): HComponentFn<T>
```

### パラメータ

#### 第一引数: `rootElement`（必須）
- **型**: `HElementFn<K> | string`
- **説明**: コンポーネントのルート要素または名前
- **選択肢**:
  - `element()`で作成した要素関数
  - 文字列（シンプルなコンポーネントの場合）

#### 第二引数: `implementation`（必須）
- **型**: `ComponentImplementation<T>`
- **説明**: コンポーネントの実装ロジック
- **引数**:
  - `props: T & StandardHTMLAttributes` - コンポーネントに渡された属性
  - `...children: HNode[]` - 子要素

### 使用パターン

#### 1. 文字列ベースのコンポーネント
```typescript
export function simpleAlert(): HComponentFn<{ message: string }> {
    return component("alert", ({ message }) => (
        <div class="alert">
            {message}
        </div>
    ));
}
```

#### 2. 要素ベースのコンポーネント
```typescript
export function userCard(): HComponentFn<{ name: string; email: string }> {
    const Card = element("user-card");
    
    return component(Card, ({ name, email }) => (
        <Card>
            <h3>{name}</h3>
            <p>{email}</p>
        </Card>
    ));
}
```

## トラブルシューティング

### よくあるエラー

#### 1. 型エラー：必須プロパティが不足
```typescript
// ❌ エラー: descriptionが必須
type CardProps = {
    title: string;
    description: string;
};

<Card title="タイトル" /> // descriptionがない

// ✅ 正しい使用方法
<Card title="タイトル" description="説明" />

// ✅ オプショナルにする場合
type CardProps = {
    title: string;
    description?: string;  // ?をつける
};
```

#### 2. コンポーネントの初期化忘れ
```typescript
// ❌ エラー: 関数を呼び出していない
const MyCard = userCard;  // 関数そのもの

// ✅ 正しい初期化
const MyCard = userCard();  // 関数を実行
```

#### 3. クラス名の重複
```typescript
// ❌ エラー: 同じクラス名を使用
const Button1 = element("button");
const Button2 = element("button");  // 名前が重複

// ✅ 正しい方法
const PrimaryButton = element("primary-button");
const SecondaryButton = element("secondary-button");
```

### デバッグのコツ

1. **TypeScriptのエラーメッセージをよく読む**
2. **コンポーネントの型定義を明確にする**
3. **簡単なコンポーネントから始めて徐々に複雑にする**
4. **コンソールで生成されたHTMLを確認する**

## まとめ

Zephblazeのコンポーネントシステムの特徴：

### 主な利点
1. **型安全性**: TypeScriptによる完全な型サポート
2. **再利用性**: コンポーネントの組み合わせで複雑なUIを構築
3. **パフォーマンス**: 静的サイト生成で高速なサイトを実現
4. **シンプルなAPI**: 直感的で分かりやすい設計

### 次のステップ
- ファイルベースルーティングの学習
- CSSスタイリングの統合
- 動的コンテンツ生成の活用

これらの基本をマスターすることで、Zephblazeを使った効率的な静的サイト開発が可能になります。
