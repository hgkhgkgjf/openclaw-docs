---
title: "Raspberry Pi 部署"
sidebarTitle: "Raspberry Pi"
description: "OpenClaw 安装部署：在树莓派上运行 24 小时在线的 Gateway。"
---

# Raspberry Pi 部署

树莓派适合做家里的小型 OpenClaw Gateway。
模型通常仍然走云端 API，所以树莓派主要负责收消息、调度、保存状态。

---

## 能不能用这块板子

| 设备 | 内存 | 建议 | 说明 |
| --- | --- | --- | --- |
| Raspberry Pi 5 | 4GB / 8GB | 最推荐 | 速度最好，余量最大。 |
| Raspberry Pi 4 | 4GB | 推荐 | 大多数家庭网关够用。 |
| Raspberry Pi 4 | 2GB | 可以 | 建议加 swap。 |
| Raspberry Pi 4 | 1GB | 勉强 | 只能跑精简配置，一定要加 swap。 |
| Raspberry Pi 3B+ | 1GB | 很慢 | 能跑，但体验会慢。 |
| Pi Zero 2 W | 512MB | 不推荐 | 内存太小，容易卡住。 |

最低要求可以记成一句话：64 位系统、至少 1GB 内存、至少 500MB 空闲磁盘。

更舒服的配置是：2GB 以上内存、16GB 以上 SD 卡或 USB SSD、有线网络。

::: tip 别在树莓派上跑本地大模型
树莓派适合做 Gateway，不适合跑本地 LLM。让 Claude、GPT 等云端模型负责思考，树莓派只负责收发消息和保存状态。
:::

---

## 推荐硬件

- Raspberry Pi 4 或 5
- 2GB 内存起步，4GB 更稳
- 64 位 Raspberry Pi OS
- 稳定电源
- 有线网络或稳定 Wi-Fi
- SD 卡或 USB SSD

不要使用 32 位系统。

---

## 安装步骤

SSH 登录树莓派后：

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
```

低内存设备建议加 swap：

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 让服务重启更稳

如果这台树莓派主要就是用来跑 OpenClaw，建议给 systemd 用户服务加一个 drop-in。
它的作用是：Gateway 崩了会自动拉起来，启动慢一点也不会被太早判定失败。

运行：

```bash
systemctl --user edit openclaw-gateway.service
```

粘贴下面内容：

```ini
[Service]
Environment=OPENCLAW_NO_RESPAWN=1
Environment=NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
Restart=always
RestartSec=2
TimeoutStartSec=90
```

保存后执行：

```bash
systemctl --user daemon-reload
systemctl --user restart openclaw-gateway.service
```

如果这是无显示器、靠 SSH 管理的树莓派，再执行一次：

```bash
sudo loginctl enable-linger "$(whoami)"
```

这样你退出 SSH 后，用户服务也能继续运行。

---

## 推荐模型配置

树莓派只跑 Gateway，所以模型建议用云端 API。

可以在 OpenClaw 配置里使用类似配置：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: ["openai/gpt-5.4-mini"]
      }
    }
  }
}
```

如果主模型临时不可用，fallback 模型还能接着处理请求。

---

## ARM 二进制注意事项

树莓派一般是 ARM64。
Node.js、Telegram、WhatsApp/Baileys、Chromium 这类常用能力通常可以正常工作。

偶尔会遇到某个技能自带 Go 或 Rust 写的小工具，只发布了 x64 版本。
这时先去对应工具的 release 页面找：

- `linux-arm64`
- `aarch64`

如果没有 ARM 版本，再考虑从源码编译，或者先跳过这个技能。

---

## 数据保存在哪里

OpenClaw 的重要状态主要在：

- `~/.openclaw/`：配置、账号授权、通道状态、会话状态。
- `~/.openclaw/workspace/`：Agent 工作区、记忆、产物。

这些文件重启后不会消失。
备份时用：

```bash
openclaw backup create
```

如果你用 USB SSD 存这些目录，通常比 SD 卡更稳，也更耐用。

---

## 访问控制 UI

从你的电脑建立隧道：

```bash
ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
```

然后打开：

```text
http://127.0.0.1:18789/
```

长期远程访问可以看 [Tailscale](/tutorials/gateway/tailscale)。
