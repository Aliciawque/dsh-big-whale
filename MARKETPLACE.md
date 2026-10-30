# Plugin markets / 插件市场 / プラグインマーケット

Submission status / 投稿状态 / 申請状況 (2026-10-30): [community posts and review links](docs/MARKET_SUBMISSIONS.md).

## English

This is an author-maintained custom index, not an official DeepSeek endorsement. In a profile with Custom Plugin Market enabled, open Plugins → Discover → Add index source and use:

```text
https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/market-index.json
```

The index offers the exact public npm release and declares its tested DSH version. Adding a source is a user action. This plugin does not add market sources automatically.

Community discovery: the repository uses the `dsh-plugin` and `deepseek-harness` topics. dsh-plugin-shop discovers those keywords/topics and applies its own checks; DSH Plugin Hub accepts public GitHub repository submissions. Discovery or submission does not guarantee listing, review or official certification.

A trilingual showcase is published in the official DSH community. Two Chinese directories and one registry have received review submissions; these are pending maintainer decisions. The central awesome-dsh-plugin entry is prepared but awaits its minimum repository-age requirement. See the dated status page above.

## 中文

这是作者维护的自定义索引。启用「自定义插件市场」后，在「插件 → 发现 → 添加索引源」添加上面的 URL，就可以从该索引发现大鲸鱼并安装精确版本。添加索引由用户操作，插件不会自动改动你的市场来源。

社区渠道：dsh-plugin-shop 会按 npm 关键词／GitHub topic 抓取并筛选；DSH Plugin Hub 提供 GitHub 仓库投稿入口；ydhrdh/dsh-marketplace 通过注册清单 PR 审核。尚未声称这些社区市场已收录，也不声称属于 DeepSeek 官方目录。

官方 DSH 社区已发布中英日三语展示帖；两个中文目录和一个注册目录已收到审核申请，是否收录以维护者决定为准。awesome-dsh-plugin 精选仓库投稿文件已准备，等待仓库创建满一天。具体链接与日期见上方投稿状态页。

## 日本語

作者が管理するカスタムインデックスです。Custom Plugin Market を有効にし、Plugins → Discover → Add index source で上記 URL を追加すると、公開 npm の固定バージョンをインストールできます。ソースの追加はユーザーが行います。プラグインが自動で変更することはありません。

コミュニティによる収集・審査と DeepSeek 公式の掲載は別です。申請やキーワードの設定だけで掲載を保証するものではありません。

公式 DSH コミュニティで三言語の紹介を公開しました。中国語のディレクトリ 2 件とレジストリ 1 件には審査を申請済みです。採用はメンテナーの判断を待っています。awesome-dsh-plugin 向けのファイルは準備済みですが、リポジトリ作成から 1 日という条件を待っています。リンクと日付は上記の申請状況を参照してください。

## Sources / 来源

- [DSH market service](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-market/README.md)
- [DSH Discover UI](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-plugin-market/README.md)
- [DSH index validator](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/util/plugin-market-index/README.md)
- [dsh-plugin-shop listing](https://github.com/LivXue/dsh-plugin-shop#-listing-a-plugin)
- [DSH Plugin Hub submission](https://dshpluginhub.dev/en/submit)
- [Community marketplace contribution](https://github.com/ydhrdh/dsh-marketplace/blob/main/CONTRIBUTING.md)
