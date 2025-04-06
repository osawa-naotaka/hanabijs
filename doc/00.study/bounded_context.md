
graph TB
    subgraph "プロジェクト管理コンテキスト"
        E1[サイト要件が定義された]
        E2[コンテンツ構造が計画された]
        E3[デザインコンセプトが承認された]
        E4[技術スタックが選定された]
    end

    subgraph "設計コンテキスト"
        E5[コンテンツモデルが定義された]
        E6[デザインルールが確立された]
    end

    subgraph "開発コンテキスト"
        E7[テンプレートが作成された]
        E8[ビルドシステムが構築された]
        E9[デプロイパイプラインが設定された]
    end

    subgraph "コンテンツ管理コンテキスト"
        E10[コンテンツとメタデータが作成された]
        E11[アセットが登録された]
        E12[メタコンテンツが生成/更新された]
        E13[コンテンツのレビューが完了した]
        E18[コンテンツが更新された]
    end

    subgraph "ビルド・デプロイコンテキスト"
        E14[ローカルビルドが実行された]
        E15[プレビューが確認された]
        E16[本番ビルド・デプロイが実行された]
        E17[公開後検証が完了した]
    end

    subgraph "サイト運用コンテキスト"
        E19[サイト分析と最適化が実施された]
    end

    %% コンテキスト間の関係
    E1 --> E2
    E2 --> E3
    E3 --> E4
    E4 --> E5

    E5 --> E6
    E6 --> E7

    E7 --> E8
    E8 --> E9
    E9 --> E10

    E10 --> E11
    E11 --> E12
    E12 --> E13
    E13 --> E14

    E14 --> E15
    E15 --> E16
    E16 --> E17
    E17 --> E18

    E18 -.-> E14
    E18 -.-> E10
    E19 -.-> E18

    %% スタイル設定
    classDef contextBorder fill:#f5f5f5,stroke:#333,stroke-width:2px;
    class "プロジェクト管理コンテキスト" contextBorder;
    class "設計コンテキスト" contextBorder;
    class "開発コンテキスト" contextBorder;
    class "コンテンツ管理コンテキスト" contextBorder;
    class "ビルド・デプロイコンテキスト" contextBorder;
    class "サイト運用コンテキスト" contextBorder;
