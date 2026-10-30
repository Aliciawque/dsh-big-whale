# 大クジラ — コーディングパートナー

[English](README.md) · [简体中文](README.zh.md) · [日本語](README.ja.md)

[![npm next](https://img.shields.io/npm/v/dsh-big-whale/next?label=npm%20next)](https://www.npmjs.com/package/dsh-big-whale/v/0.6.0-rc.2)

DeepSeek Harness 用のクジラ娘コンパニオンです。コードを書く時間に寄り添い、イベントに合わせて声や表情を変えます。コンテキストが圧縮されると、大きなご飯を持ちます。

<img src="docs/preview.png" width="330" alt="大クジラの全身プレビュー">

機能紹介動画：[YouTube 英語版](https://www.youtube.com/watch?v=cyWnZlAHyJU) · [Bilibili 中国語版](https://www.bilibili.com/video/BV17mxe6bEpe/)。

## 機能

- 中国語・英語・日本語の収録音声と滑らかなリップシンク。会話中も表情を変更できます。
- マウス追従、ドラッグの慣性、ダブルクリックの上半身表示、髪と目の物理表現。
- 5種類の待機モーション、8種類の表情、イベントに合わせた自動表情。
- クリックへの反応、集中を促す声、イベント音声、ご飯のポーズ。
- 小さなクジラのメニュー。Windows デスクトップ表示と DSH ページ内表示。

## インストール

動作確認済み：**DSH 0.2.1-rc.5**、**Node.js 22.17+**。既存の Web 用 profile にインストールしてください。`web` は使用中の profile 名に置き換えられます。

```sh
dsh plugin --profile web add dsh-big-whale@0.6.0-rc.2
dsh web
```

DSH が起動中の場合は、その profile を再起動してください。公開プレリリースのタグは `dsh-big-whale@next` です。

Windows デスクトップ表示には、任意依存の公式 Electron ランタイムを使います。依存パッケージのインストールスクリプトが実行されなかった場合は、インストール済みプラグインのディレクトリで次を実行し、DSH を再起動します。

```sh
node bin/desktop.mjs setup
```

DSH のブラウザを最小化しても、デスクトップ表示は残ります。DSH のホストプロセスは起動したままにしてください。クジラメニューから閉じ、DSH のクジラアイコンから再び開けます。ランタイムが利用できない場合はページ内に表示されます。

## 操作

ドラッグで移動し、ダブルクリックで全身／上半身を切り替えます。小さなクジラをクリックすると、言語、自己紹介、待機モーション、表情、ご飯のポーズを選べます。

待機モーション：自然な呼吸、体のひねり、左右への傾き、照れた揺れ、複合モーション。表情：通常、喜び、笑い目、冷淡、驚き、涙、甘える表情、少し怒った表情、イベント連動。

収録済み音声に Gemini や GLM のキーは不要です。DSH のモデル・プロバイダー設定はそのまま使います。任意の新しい文章の即時 TTS は含みません。単語は音声に合わせて整列していますが、単語内の音素の長さは推定です。

## プラグインマーケット

DSH のフォーマット1検証に合格したインデックス：

```text
https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/market-index.json
```

Custom Plugin Market を有効にした profile で、**Plugins → Discover → Add index source** から追加してください。コミュニティの収集・審査と公式掲載は別の手続きです。[詳細](MARKETPLACE.md)。

## ライセンスとクレジット

プラグインのコードには MIT の表記があります。キャラクター原案と派生ビジュアルは **CC BY-NC-SA 4.0**（表示・非営利・継承）です。原案：**上善无形、ZipZipPipe**。コードのライセンスはキャラクターの商用利用を許可しません。

DeepSeek 公式ではないファン制作プロジェクトです。画像には AI による制作・調整を含み、音声は合成音声です。

[クレジット](ATTRIBUTION.md) · [ライセンス](LICENSE) · [プライバシー](PRIVACY.md) · [検証](docs/VERIFICATION.md) · [紹介文案](docs/PROMOTION.md) · [Issues](https://github.com/Aliciawque/dsh-big-whale/issues)
