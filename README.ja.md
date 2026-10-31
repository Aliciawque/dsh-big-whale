# 大クジラ — コーディングパートナー

[English](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.md) · [简体中文](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.zh.md) · [日本語](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.ja.md)

[![npm next](https://img.shields.io/npm/v/dsh-big-whale/next?label=npm%20next)](https://www.npmjs.com/package/dsh-big-whale/v/0.6.0-rc.5)

DeepSeek Harness 用のクジラ娘コンパニオンです。コードを書く時間に寄り添い、イベントに合わせて声や表情を変えます。コンテキストが圧縮されると、大きなご飯を持ちます。

<img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/preview.png" width="330" alt="大クジラの全身プレビュー">

機能紹介動画：[YouTube 英語版](https://www.youtube.com/watch?v=cyWnZlAHyJU) · [Bilibili 中国語版](https://www.bilibili.com/video/BV17mxe6bEpe/)。

## ハロウィンの魔女衣装

浮かぶクジラのメニューで **衣装 → 小さな魔女** を選びます。**いつものメイド服** で元に戻せます。魔女衣装ではメニューボタンが小さなカボチャになります。

- **レイヤー構成：** 帽子、ケープ、胸のリボン、袖、カフス、多段スカートに個別の揺れと反動があります。
- **おばけランタン：** 右手に持ったランタンが手より遅れて左右に揺れ、暗い／半分の明るさ／明るい状態を繰り返します。
- **専用ご飯ポーズ：** 魔女の袖と両手で大きな白いご飯を持ちます。**ご飯ポーズ** で確認できます。
- **共通の操作：** 両衣装の体の大きさは共通です。表情、待機モーション、マウス追従、音声操作を引き継ぎ、メニューはキャラクターを避けて開きます。振幅スライダーも利用できます。

ユーザー操作で魔女衣装に切り替えると、選択中の言語で着替えのセリフを再生します。

| 中文 | English | 日本語 |
| --- | --- | --- |
| 我是小魔女，不给糖就捣乱！ | I'm a little witch. Trick or treat! | 私は小さな魔女。お菓子をくれなきゃ、いたずらしちゃうよ！ |

<table>
<tr><th>魔女衣装・上半身 · 2048 × 2560</th><th>魔女衣装・全身 · 2048 × 3640</th></tr>
<tr>
<td align="center"><a href="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-halfbody-hd.png"><img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-halfbody-hd.png" height="520" alt="魔女衣装・上半身"></a></td>
<td align="center"><a href="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-fullbody-hd.png"><img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-fullbody-hd.png" height="520" alt="魔女衣装・全身"></a></td>
</tr>
</table>

公開済み **0.6.0-rc.5** モデルから直接レンダリングした画像です。クリックすると原寸PNGを表示できます。


## 機能

- 中国語・英語・日本語の収録音声と滑らかなリップシンク。会話中も表情を変更できます。
- マウス追従、ドラッグの慣性、ダブルクリックの上半身表示、髪と目の物理表現。
- 5種類の待機モーション、8種類の表情、イベントに合わせた自動表情。
- クリックへの反応、集中を促す声、イベント音声、ご飯のポーズ。
- 小さなクジラのメニュー。Windows デスクトップ表示と DSH ページ内表示。

## インストール

動作確認済み：**DSH 0.2.1-rc.5**、**Node.js 22.17+**。既存の Web 用 profile にインストールしてください。`web` は使用中の profile 名に置き換えられます。

```sh
dsh plugin --profile web add dsh-big-whale@0.6.0-rc.5
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

待機モーションの下にあるスライダーで、揺れの振幅を20%〜120%に調整できます（初期値80%）。変更はすぐに反映され、再起動後も保持されます。自然な呼吸は元の穏やかな動きを維持します。

収録済み音声に Gemini や GLM のキーは不要です。DSH のモデル・プロバイダー設定はそのまま使います。任意の新しい文章の即時 TTS は含みません。単語は音声に合わせて整列していますが、単語内の音素の長さは推定です。

## プラグインマーケット

DSH のフォーマット1検証に合格したインデックス：

```text
https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/market-index.json
```

Custom Plugin Market を有効にした profile で、**Plugins → Discover → Add index source** から追加してください。コミュニティの収集・審査と公式掲載は別の手続きです。[詳細](https://github.com/Aliciawque/dsh-big-whale/blob/main/MARKETPLACE.md)。

## コミュニティへの賛同

本プロジェクトは、[LINUX DO](https://linux.do/) コミュニティのオープンな交流と知識共有を支持します。

## ライセンスとクレジット

プラグインのコードには MIT の表記があります。キャラクター原案と派生ビジュアルは **CC BY-NC-SA 4.0**（表示・非営利・継承）です。原案：**上善无形、ZipZipPipe**。コードのライセンスはキャラクターの商用利用を許可しません。

DeepSeek 公式ではないファン制作プロジェクトです。画像には AI による制作・調整を含み、音声は合成音声です。

[クレジット](https://github.com/Aliciawque/dsh-big-whale/blob/main/ATTRIBUTION.md) · [ライセンス](https://github.com/Aliciawque/dsh-big-whale/blob/main/LICENSE) · [プライバシー](https://github.com/Aliciawque/dsh-big-whale/blob/main/PRIVACY.md) · [検証](https://github.com/Aliciawque/dsh-big-whale/blob/main/docs/VERIFICATION.md) · [紹介文案](https://github.com/Aliciawque/dsh-big-whale/blob/main/docs/PROMOTION.md) · [Issues](https://github.com/Aliciawque/dsh-big-whale/issues)
