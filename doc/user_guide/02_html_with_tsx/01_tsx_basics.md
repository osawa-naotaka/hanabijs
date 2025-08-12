# Zephblazeにおけるtsxを使ったサイト構築

このガイドでは、Zephblazeでtsxを使ってサイトを構築する基本的な方法について説明します。

## tsxファイルの基本構造

Zephblazeのサイトはtsxファイルを使って構築します。各ページは`xxx.html.tsx`という命名規則に従い、HTMLノードを返す関数を定義します。

### 基本的な例

```tsx
import type { HRootPageFn, Store } from "zephblaze/core";

export default function Root(_store: Store): HRootPageFn<void> {
    return async () => (
        <html lang="en">
            <head>
                <title>Hello, Zephblaze!</title>
            </head>
            <body>
                <h1>Hello, Zephblaze!</h1>
            </body>
        </html>
    );
}
```

## 重要な概念

### 1. Default Export

Zephblazeのページファイルはdefaultエクスポートとして関数を定義する必要があります。

```tsx
export default function Root(_store: Store): HRootPageFn<void> {
    // ...
}
```

### 2. Store型の引数

全てのページ関数は第一引数として`Store`型のオブジェクトを受け取ります。このStoreオブジェクトを通じて、アプリケーションの状態管理や各種機能にアクセスできます。

### 3. HRootPageFn型の戻り値

ページ関数は`HRootPageFn`型を返す必要があります。この型は**async関数**を表し、実際のHTML生成時に呼び出されてHTMLノードを返します。

```tsx
// HRootPageFn<void>は以下のような構造です：
// type HRootPageFn<T> = (parameter: T) => Promise<HNode>;
// HNodeはzephblaze内部で利用するDOMの型です

export default function Root(_store: Store): HRootPageFn<void> {
    return async () => { // ← この async 関数が HRootPageFn
        return (
            <html>
                <head><title>Example</title></head>
                <body><h1>Content</h1></body>
            </html>
        );
    };
}
```

### 4. テンプレート型パラメータ

`HRootPageFn`のテンプレート型パラメータは、HTML生成時の関数の引数の型を表します。

```tsx
// 引数なしの場合
export default function Root(_store: Store): HRootPageFn<void> {
    return async () => (/* jsx */);
}

// 引数ありの場合（例：ページパラメータ）
export default function Root(_store: Store): HRootPageFn<{ id: string }> {
    return async ({ id }) => (
        <html>
            <head><title>Page {id}</title></head>
            <body><h1>Page ID: {id}</h1></body>
        </html>
    );
}
```

## まとめ

Zephblazeでのtsxサイト構築では：

1. **ファイル命名**: `xxx.html.tsx`の規則に従う
2. **エクスポート**: default exportで関数を定義
3. **引数**: `Store`型のオブジェクトを受け取る
4. **戻り値**: `HRootPageFn<T>`型を返す
5. **実装**: async関数でjsx要素を返す
6. **型安全性**: TypeScriptの恩恵を受けながら開発できる

この基本的な構造を理解することで、Zephblazeを使った柔軟で型安全なWebサイト開発が可能になります。
