# Zephblazeのファイルベースルーター

Zephblazeは**ファイルベースルーティング**を採用しており、`site/pages/`ディレクトリ以下のファイル構造に基づいて自動的にルートとHTMLファイルを生成します。

## 基本的なルーティング

### ディレクトリ構造とルート生成

```
site/pages/
├── index.html.tsx        → / および /index.html
├── about.html.tsx        → /about.html
└── posts/
    └── hello.html.tsx    → /posts/hello.html
```

Zephblazeは`.html.tsx`ファイルから以下のファイルを自動生成します：

- HTMLファイル（主要なコンテンツ）
- CSSファイル（スタイル）
- JavaScriptファイル（クライアントサイド機能）
- フォントファイル（.woff2形式）

## パラメータを使った動的ルーティング

### [param_name]記法

ファイル名やディレクトリ名を`[param_name]`で囲むことで、複数のパラメータを用いたHTMLファイルを動的に生成できます。

```
site/pages/
├── posts/[slug].html.tsx     → 複数の記事ページを生成
├── tags/[tag].html.tsx       → 複数のタグページを生成
└── users/[id]/
    └── profile.html.tsx      → ユーザー別プロフィールページを生成
```

### パラメータ生成関数

`rootPageFnParameters`関数を定義することで、生成すべきパラメータの組み合わせを指定できます。

#### 基本的な型定義

```typescript
// パラメータの型を定義
type RootParameter = {
    slug: string;
};

// 非同期版のパラメータ生成関数
export async function rootPageFnParameters(): Promise<RootParameter[]> {
    // データベースやファイルシステムからパラメータを取得
    const posts = await getPostList();
    return posts.map(post => ({ slug: post.slug }));
}

// 同期版のパラメータ生成関数
export function rootPageFnParameters(): RootParameter[] {
    return [
        { slug: "hello-world" },
        { slug: "getting-started" },
        { slug: "advanced-tips" }
    ];
}
```

#### 実際の実装例

**ブログ記事ページ（posts/[slug].html.tsx）:**

```typescript
import type { HRootPageFn, Store } from "zephblaze/core";
import { listFiles, getMarkdown } from "../../../lib/post";
import path from "path";

// パラメータの型定義
type RootParameter = {
    slug: string;
};

// パラメータ生成関数（非同期）
export async function rootPageFnParameters(): Promise<RootParameter[]> {
    const posts_dir = "./content/posts";
    const markdownFiles = await listFiles(posts_dir, ".md");
    
    return markdownFiles.map(filePath => ({
        slug: path.basename(filePath, ".md")
    }));
}

// ページ生成関数
export default function Root(_store: Store): HRootPageFn<RootParameter> {
    return async ({ slug }) => {
        // パラメータを使ってコンテンツを取得
        const post = await getMarkdown("./content/posts", slug);
        
        return (
            <html lang="ja">
                <head>
                    <title>{post.title}</title>
                    <meta name="description" content={post.description} />
                </head>
                <body>
                    <article>
                        <h1>{post.title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: post.html }} />
                    </article>
                </body>
            </html>
        );
    };
}
```

**タグページ（tags/[tag].html.tsx）:**

```typescript
import type { HRootPageFn, Store } from "zephblaze/core";

// パラメータの型定義
type RootParameter = {
    tag: string;
};

// 静的なタグマップ
const tag_map = {
    "javascript": ["post1", "post3"],
    "typescript": ["post2", "post4"],
    "react": ["post1", "post2"]
};

// パラメータ生成関数（同期）
export function rootPageFnParameters(): RootParameter[] {
    return Object.keys(tag_map).map(tag => ({ tag }));
}

// ページ生成関数
export default function Root(_store: Store): HRootPageFn<RootParameter> {
    return async ({ tag }) => {
        const posts = tag_map[tag] || [];
        
        return (
            <html lang="ja">
                <head>
                    <title>タグ: {tag}</title>
                </head>
                <body>
                    <h1>タグ: {tag}</h1>
                    <ul>
                        {posts.map(post => (
                            <li key={post}>
                                <a href={`/posts/${post}.html`}>{post}</a>
                            </li>
                        ))}
                    </ul>
                </body>
            </html>
        );
    };
}
```

## 複数パラメータの例

### ネストしたパラメータ

```typescript
// site/pages/users/[userId]/posts/[postId].html.tsx

type RootParameter = {
    userId: string;
    postId: string;
};

export async function rootPageFnParameters(): Promise<RootParameter[]> {
    const users = await getUsers();
    const results: RootParameter[] = [];
    
    for (const user of users) {
        const posts = await getUserPosts(user.id);
        for (const post of posts) {
            results.push({
                userId: user.id,
                postId: post.id
            });
        }
    }
    
    return results;
}

export default function Root(_store: Store): HRootPageFn<RootParameter> {
    return async ({ userId, postId }) => {
        const user = await getUser(userId);
        const post = await getPost(postId);
        
        return (
            <html>
                <head>
                    <title>{post.title} - {user.name}</title>
                </head>
                <body>
                    <nav>
                        <a href={`/users/${userId}/profile.html`}>
                            {user.name}のプロフィール
                        </a>
                    </nav>
                    <article>
                        <h1>{post.title}</h1>
                        <p>著者: {user.name}</p>
                        <div>{post.content}</div>
                    </article>
                </body>
            </html>
        );
    };
}
```

## 型定義の詳細

### HRootPageFn型

```typescript
// HRootPageFn の型定義
type HRootPageFn<T> = (parameter: T) => Promise<HNode>;

// HNode はzephblaze内部で利用するDOM要素の型
// 通常のjsx要素（React.ReactElement相当）として扱える
```

### パラメータ生成関数の型

```typescript
// 同期版
type SyncParameterFunction<T> = () => T[];

// 非同期版  
type AsyncParameterFunction<T> = () => Promise<T[]>;

// どちらも利用可能
export function rootPageFnParameters(): RootParameter[] { ... }
export async function rootPageFnParameters(): Promise<RootParameter[]> { ... }
```

### Store型

```typescript
// Store型はアプリケーション全体の状態管理オブジェクト
// 各ページで共通のデータやユーティリティ関数にアクセス可能
export default function Root(store: Store): HRootPageFn<RootParameter> {
    // store.config でアプリケーション設定にアクセス
    // store.utils でユーティリティ関数にアクセス
    return async (params) => { ... };
}
```

## ビルド時の処理フロー

1. **ファイルスキャン**: `site/pages/`以下の`.html.tsx`ファイルを検出
2. **パラメータ生成**: `rootPageFnParameters`関数を実行してパラメータリストを取得
3. **ファイル生成**: 各パラメータセットに対してHTMLファイルを生成
4. **パス置換**: ファイルパス内の`[param]`をパラメータ値で置換
5. **静的ファイル出力**: `dist/`ディレクトリに最終的なHTMLファイルを出力

## まとめ

Zephblazeのファイルベースルーターの特徴：

1. **直感的なファイル構造**: ディレクトリ構造がそのままURL構造に対応
2. **動的パラメータ**: `[param]`記法による柔軟なパラメータ化
3. **型安全性**: TypeScriptによる完全な型チェック
4. **自動生成**: HTML、CSS、JavaScript、フォントファイルの自動生成
5. **開発効率**: コード補完とリファクタリング支援

この仕組みにより、大量の類似ページを効率的に生成しながら、型安全性を保った開発が可能になります。