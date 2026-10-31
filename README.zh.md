# 大鲸鱼 — 陪你写代码的桌宠

[English](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.md) · [简体中文](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.zh.md) · [日本語](https://github.com/Aliciawque/dsh-big-whale/blob/main/README.ja.md)

[![npm next](https://img.shields.io/npm/v/dsh-big-whale/next?label=npm%20next)](https://www.npmjs.com/package/dsh-big-whale/v/0.6.0-rc.5)

给 DeepSeek Harness 使用的鲸鱼娘编程伙伴。写代码时陪着你，根据事件切换语音和表情；上下文压缩时，会捧起一碗超大的白米饭。

## 日常女仆装

<table>
<tr><th>女仆装半身细节 · 2048 × 2560</th><th>女仆装全身展示 · 2048 × 3640</th></tr>
<tr>
<td align="center"><a href="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/maid-halfbody-hd.png"><img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/maid-halfbody-hd.png" height="520" alt="女仆装半身细节"></a></td>
<td align="center"><a href="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/maid-fullbody-hd.png"><img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/maid-fullbody-hd.png" height="520" alt="女仆装全身展示"></a></td>
</tr>
</table>

截图由已发布的 **0.6.0-rc.5** 模型原生渲染。点击任意图片可查看完整分辨率 PNG。

观看 [B站中文版功能演示](https://www.bilibili.com/video/BV17mxe6bEpe/)或 [YouTube 英文版](https://www.youtube.com/watch?v=cyWnZlAHyJU)。

## 万圣节小魔女套装

点击游动的小鲸鱼，在 **套装 → 小魔女** 切换装扮；选择 **日常女仆** 即可换回。魔女套使用小南瓜菜单按钮。

- **分层服装：** 女巫帽、披风、胸前蝴蝶结、袖子、袖口和多层裙摆分别保留回弹物理。
- **鬼魂提灯：** 右手提着复古灯，灯体有滞后左右摇摆，亮度按暗色／半亮／亮循环。
- **专属捧饭：** 魔女袖子和双手捧着超大白米饭，可点击 **捧饭预览** 查看。
- **通用调控：** 两套服装的身体大小一致，表情、待机动作、鼠标跟随与语音控制通用；菜单避开人物展开，待机动作幅度滑块保留。

主动切换为小魔女时，会按当前所选语言播放换装台词：

| 中文 | English | 日本語 |
| --- | --- | --- |
| 我是小魔女，不给糖就捣乱！ | I'm a little witch. Trick or treat! | 私は小さな魔女。お菓子をくれなきゃ、いたずらしちゃうよ！ |

<table>
<tr><th>魔女套半身细节 · 2048 × 2560</th><th>魔女套全身展示 · 2048 × 3640</th></tr>
<tr>
<td align="center"><a href="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-halfbody-hd.png"><img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-halfbody-hd.png" height="520" alt="魔女套半身细节"></a></td>
<td align="center"><a href="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-fullbody-hd.png"><img src="https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/docs/screenshots/witch-fullbody-hd.png" height="520" alt="魔女套全身展示"></a></td>
</tr>
</table>

截图由已发布的 **0.6.0-rc.5** 模型原生渲染。点击任意图片可查看完整分辨率 PNG。


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
