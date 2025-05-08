# 四柱推命アプリ（Four Pillars of Destiny）

四柱推命（しちゅうすいめい）の命式を計算し表示するWebアプリケーションです。生年月日と性別を入力することで、四柱推命における八字（はっじ）と呼ばれる命式を計算し、五行や陰陽のバランス、干合・支合などの情報を表示します。

## 機能

- 生年月日と性別から四柱推命の命式（八字）を計算
- 天干・地支・蔵干の表示
- 五行（木・火・土・金・水）のバランス表示
- 陰陽のバランス表示
- 干合・支合・冲・刑などの関係性表示

## インストールと実行方法

### ローカルでの実行

1. リポジトリをクローンまたはダウンロードします
   ```
   git clone https://github.com/yourusername/four-pillars.git
   cd four-pillars
   ```

2. プロジェクトのルートディレクトリにある`index.html`ファイルをブラウザで開きます

または、以下のいずれかの方法でHTTPサーバーを起動して使用することもできます：

* VSCodeのLive Server拡張機能を使用する
* Pythonの簡易HTTPサーバーを使用する: `python -m http.server 3000`

### GitHub Pagesでの利用

このアプリケーションはGitHub Pagesで公開されています。以下のURLでアクセスできます：

```
https://yourusername.github.io/four-pillars/
```

## GitHub Pagesへのデプロイ方法

1. GitHubでリポジトリを作成します

2. リポジトリをクローンします
   ```
   git clone https://github.com/yourusername/four-pillars.git
   cd four-pillars
   ```

3. コードを追加してコミットします
   ```
   git add .
   git commit -m "四柱推命アプリの初期コミット"
   ```

4. GitHubにプッシュします
   ```
   git push origin main
   ```

5. GitHub Pagesを有効化します
   - リポジトリ設定ページに移動します
   - 「Pages」セクションに移動します
   - ソースブランチとして「main」を選択します
   - 「Save」をクリックします

6. 数分後、アプリケーションが以下のURLで公開されます：
   ```
   https://yourusername.github.io/four-pillars/
   ```

## 使い方

1. 生年月日を入力します（必須）
2. 生まれた時間がわかる場合は入力します（任意）
3. 性別を選択します（必須）
4. 「命式を計算する」ボタンをクリックします
5. 計算結果が表示されます

## プロジェクト構成

このプロジェクトは純粋なHTML/CSS/JavaScriptを使用した静的ウェブサイトとして実装されています。

```
/
├── index.html         # メインHTMLファイル
├── .nojekyll          # GitHub Pagesの処理を制御するファイル
├── src/               # ソースコード
│   ├── app.js         # アプリケーションのエントリーポイント
│   ├── components/    # UIコンポーネント
│   │   ├── BirthdayForm.js  # 入力フォームコンポーネント
│   │   └── MeishikiResult.js # 結果表示コンポーネント
│   ├── data/          # データ定義
│   │   └── kanshiData.js # 干支データ
│   ├── styles/        # スタイル
│   │   └── styles.css  # スタイルシート
│   └── utils/         # ユーティリティ
│       └── meishikiCalculator.js # 命式計算ロジック
└── README.md          # プロジェクト説明
```

## 技術スタック

- HTML / CSS / JavaScript (ES6+)
- モジュールパターン
- オブジェクト指向プログラミング

## 将来の展望

- React / React Nativeへの移植
- より詳細な命式解析機能の追加
- 運勢の計算と表示
- 保存機能の追加

## 参考資料

- [参考リポジトリ](https://github.com/hajime-f/destiny)
- その他四柱推命関連の書籍や資料

## ライセンス

MIT 