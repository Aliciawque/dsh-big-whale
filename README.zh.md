# 大鲸鱼 — 陪你写代码的桌宠

[English](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.md) · [简体中文](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.zh.md) · [日本語](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.ja.md)

[![npm next](https://img.shields.io/npm/v/dsh-big-whale/next?label=npm%20next)](https://www.npmjs.com/package/dsh-big-whale/v/0.6.0-rc.5)

给 DeepSeek Harness 使用的鲸鱼娘编程伙伴。写代码时陪着你，根据事件切换语音和表情；上下文压缩时，会捧起一碗超大的白米饭。

<img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/preview.png" width="330" alt="大鲸鱼编程桌宠全身预览">

观看 [B站中文版功能演示](https://www.bilibili.com/video/BV17mxe6bEpe/)或 [YouTube 英文版](https://www.youtube.com/watch?v=cyWnZlAHyJU)。

### 万圣节小魔女套装

在桌宠菜单中选择 **套装 → 小魔女**。魔女拥有分层帽子、摇摆发光的鬼魂提灯、配套捧饭动作，主动换装时会按当前语言说中／英／日台词。两套服装的身体大小一致。菜单会避开人物，窄窗口采用上下分区，收起后恢复保存的大小；待机动作幅度滑块保留。


## 可以做什么

- 中、英、日三语录音和连续口型，讲话时也能切换表情。
- 鼠标跟随、拖动惯性、双击切换半身，头发与眼睛的物理效果。
- 五种待机动作、八种表情，以及跟随事件的自动表情。
- 点击互动、催你专心、事件播报和捧饭动作。
- 游动的小鲸鱼菜单；支持 Windows 独立桌面模式和 DSH 页内显示。

## 安装

已测试 **DSH 0.2.1-rc.5**、**Node.js 22.17+**。请安装到已有的 Web 类型 profile；下面的 `web` 可替换为你的 profile 名称。

```sh
dsh plugin --profile web add dsh-big-whale@0.6.0-rc.5
dsh web
```

如果 DSH 已在运行，安装后重启对应 profile。公开预发布频道为 `dsh-big-whale@next`。

Windows 桌面模式使用可选的官方 Electron 运行时。如果包管理器跳过了依赖安装脚本，在已安装的插件目录执行以下命令，然后重启 DSH：

```sh
node bin/desktop.mjs setup
```

DSH 浏览器最小化后，她仍能留在桌面上；DSH 宿主进程需要保持运行。通过小鲸鱼菜单关闭她，再从 DSH 的小鲸鱼入口重新开启。没有可用桌面运行时时，会在 DSH 页面内显示。

## 操作

拖动调整位置，双击切换全身／半身。点击游动的小鲸鱼，可选语言、播放自我介绍、切换待机动作和表情，也可以触发捧饭。

待机：自然呼吸、扭身、左右倾身、害羞摇摆、综合展示。表情：正常、开心、眯眼笑、冷淡、惊讶、流泪、卖萌、撒娇生气，以及跟随事件。

待机动作下方的幅度滑块可调节 20%–120% 的摆动幅度，默认 80%。调整立即生效，重启后保留；自然呼吸保持原有的轻微幅度。

内置语音不需要 Gemini 或 GLM 密钥，DSH 继续使用你自己的模型和提供方配置。目前不包含任意新文本即时 TTS；词级对齐为声学对齐，词内音素时长仍是估计。

## 插件市场

仓库提供已通过 DSH 格式 1 校验的索引：

```text
https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/market-index.json
```

在启用「自定义插件市场」的 DSH profile 中，打开 **插件 → 发现 → 添加索引源**，添加上面的地址。社区目录的抓取、审核与官方收录各有独立流程，详见 [市场说明](https://github.com/Aliciawque/dsh-big-whale/blob/main/MARKETPLACE.md)。

## 社区认可

本项目认可并支持 [LINUX DO](https://linux.do/) 社区的开放交流与知识分享。

## 许可与署名

插件代码保留 MIT 声明。角色设定与衍生美术遵循 **CC BY-NC-SA 4.0**：署名、非商用、相同方式共享。原设署名：**上善无形、ZipZipPipe**。代码许可不等于角色商用授权。

这是同人社区项目，非 DeepSeek 官方产品。图片包含 AI 辅助生成、分层和修整，语音为合成语音。

[署名](https://github.com/Aliciawque/dsh-big-whale/blob/main/ATTRIBUTION.md) · [许可](https://github.com/Aliciawque/dsh-big-whale/blob/main/LICENSE) · [隐私](https://github.com/Aliciawque/dsh-big-whale/blob/main/PRIVACY.md) · [验证记录](https://github.com/Aliciawque/dsh-big-whale/blob/main/docs/VERIFICATION.md) · [宣传草稿](https://github.com/Aliciawque/dsh-big-whale/blob/main/docs/PROMOTION.md) · [反馈](https://github.com/Aliciawque/dsh-big-whale/issues)
