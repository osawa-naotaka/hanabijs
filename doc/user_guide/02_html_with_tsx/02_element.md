# Zephblazeのエレメント

前章では、TSXを使った基本的なサイト構築について説明しました。このガイドでは、独自のHTML要素を定義する`element()`関数の使い方と活用方法について詳しく解説します。

## 独自要素とは？

Zephblazeでは、標準的なHTML要素（`<div>`、`<h1>`、`<p>`など）に加えて、意味的により具体的な独自要素を作成できます。独自要素は、既存のHTML要素に自動的にCSSクラス名を付与し、コードの可読性とスタイルの管理を向上させます。

## 基本的な使用例

以下は、サイトのタイトルを表す独自要素`SiteTitle`の例です：

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

### コードの解説

1. **`element()`関数の呼び出し**
   - 第一引数: `"site-title"` - 要素に付与されるCSSクラス名
   - 第二引数: `{ tag: "h1" }` - 実際に生成されるHTMLタグの種類

2. **変数への格納**
   - `const SiteTitle = element(...)`で独自要素を作成
   - 変数名は通常、パスカルケース（大文字始まり）を使用

3. **TSX内での使用**
   - 作成した要素を`<SiteTitle>...</SiteTitle>`として使用
   - 通常のHTML要素と同じように扱える

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
        <h1 class="site-title">Hello, Zephblaze!</h1>
    </body>
</html>
```

## 独自要素を使う理由

### 1. セマンティック（意味的）な明確性

`<h1>`要素は「ページの最上位見出し」を意味しますが、`<SiteTitle>`要素は「Webサイトのタイトル」というより具体的な意味を表現できます。これにより：

- コードの可読性が向上
- 開発者間での意図の共有が容易
- 保守性の向上

### 2. CSSスタイリングの効率化

自動的に付与されるCSSクラス名により、特定の要素のみにスタイルを適用できます：

```css
/* サイトタイトルのみにスタイルを適用 */
.site-title {
    font-size: 2rem;
    color: #2563eb;
    font-weight: bold;
}

/* 他のh1要素は影響を受けない */
h1 {
    font-size: 1.5rem;
}
```

### 3. コンポーネント化への発展

独自要素は後にコンポーネント化する際の基盤となり、再利用可能なUIパーツへと発展できます。


## `element()`関数の詳細

### 基本的な構文

```typescript
element<K extends Tag | ZephblazeTag = "div">(
    element_name: string,
    options?: ElementOptions<K>
): HElementFn<K>
```

### パラメータ

#### 第一引数: `element_name`（必須）
- **型**: `string`
- **説明**: 要素の識別名でありCSSクラス名になる
- **命名規則**: ケバブケース（`kebab-case`）を推奨
- **例**: `"site-title"`, `"user-avatar"`, `"nav-menu"`

#### 第二引数: `options`（オプション）
- **型**: `ElementOptions<K>`
- **説明**: 要素の詳細設定を指定するオブジェクト

**設定可能なプロパティ:**

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|---------|
| `tag` | `K` | `"div"` | 実際に生成されるHTMLタグ |
| `class` | `string \| string[]` | なし | 追加のCSSクラス名 |

### 戻り値
- **型**: `HElementFn<K>`
- **説明**: HTML要素を生成する関数
- **使用方法**: TSX内で`<要素名>...</要素名>`として使用

## 使用例とパターン

### 1. 基本パターン（divタグ）

```typescript
const UserCard = element("user-card");
// 生成: <div class="user-card">...</div>
```

### 2. 特定のHTMLタグを指定

```typescript
const ArticleTitle = element("article-title", { tag: "h2" });
// 生成: <h2 class="article-title">...</h2>

const DateDisplay = element("date-display", { tag: "time" });
// 生成: <time class="date-display">...</time>
```

### 3. 追加のCSSクラスを指定

```typescript
// 単一のクラスを追加
const PrimaryButton = element("primary-btn", { 
    tag: "button", 
    class: "btn" 
});
// 生成: <button class="primary-btn btn">...</button>

// 複数のクラスを追加
const AlertMessage = element("alert-msg", { 
    class: ["alert", "alert-warning", "fade-in"] 
});
// 生成: <div class="alert-msg alert alert-warning fade-in">...</div>
```

### 4. セマンティックな要素の活用

```typescript
// ナビゲーション関連
const MainNav = element("main-nav", { tag: "nav" });
const NavList = element("nav-list", { tag: "ul" });
const NavItem = element("nav-item", { tag: "li" });

// 記事関連
const BlogPost = element("blog-post", { tag: "article" });
const PostHeader = element("post-header", { tag: "header" });
const PostContent = element("post-content", { tag: "section" });
```

## 実践的な使用例

以下は、複数の独自要素を組み合わせた実際のページ例です：

```typescript
import type { HRootPageFn, Store } from "zephblaze/core";
import { element } from "zephblaze/core";

export default function Root(_store: Store): HRootPageFn<void> {
    // 独自要素の定義
    const PageHeader = element("page-header", { tag: "header" });
    const SiteTitle = element("site-title", { tag: "h1" });
    const MainContent = element("main-content", { tag: "main" });
    const WelcomeMessage = element("welcome-msg", { tag: "section" });
    const CallToAction = element("cta-button", { 
        tag: "button", 
        class: ["btn", "btn-primary"] 
    });
    
    return async () => (
        <html lang="ja">
            <head>
                <title>Zephblaze デモサイト</title>
            </head>
            <body>
                <PageHeader>
                    <SiteTitle>
                        <a href="/">Zephblaze Demo</a>
                    </SiteTitle>
                </PageHeader>
                
                <MainContent>
                    <WelcomeMessage>
                        <h2>ようこそ！</h2>
                        <p>Zephblazeで作られたデモサイトです。</p>
                        <CallToAction>始める</CallToAction>
                    </WelcomeMessage>
                </MainContent>
            </body>
        </html>
    );
}
```

## ベストプラクティス

### 命名規則
- **要素名**: ケバブケース（`"user-profile"`, `"nav-menu"`）
- **変数名**: パスカルケース（`UserProfile`, `NavMenu`）
- **意味的で分かりやすい名前を使用**

### 適切なHTMLタグの選択
- セマンティックHTMLの原則に従う
- アクセシビリティを考慮したタグ選択
- 例: ナビゲーション → `nav`、記事 → `article`、時刻 → `time`

### CSSクラスの活用
- デザインシステムのクラスと組み合わせる
- 既存のCSSフレームワークとの連携
- 状態やバリエーションを表現する追加クラスの使用

