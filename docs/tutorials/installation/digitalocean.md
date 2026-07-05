---
title: "DigitalOcean 部署"
sidebarTitle: "DigitalOcean"
description: "OpenClaw 安装部署：在 DigitalOcean Droplet 上运行继续在线的 Gateway。"
---

# DigitalOcean 部署

DigitalOcean Droplet 是比较直接的 VPS 路线。
你可以把 OpenClaw 放在一台 Ubuntu 服务器上，让它长期在线。

---

## 推荐配置

新手轻量使用可以从：

- Ubuntu 24.04 LTS
- 1 vCPU / 1GB RAM
- 25GB SSD
- SSH key 登录

如果频道多、自动化多、浏览器工具多，建议选更大的机器。

---

## 安装步骤

SSH 登录服务器：

```bash
ssh root@YOUR_DROPLET_IP
```

更新系统并安装 OpenClaw：

```bash
apt update && apt upgrade -y
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
```

1GB 内存机器建议加 swap：

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 打开控制 UI

最安全简单的方式是 SSH 隧道：

```bash
ssh -N -L 18789:localhost:18789 root@YOUR_DROPLET_IP
```

然后打开：

```text
http://localhost:18789/
```

也可以用 Tailscale，但不要直接把 Gateway 端口裸露到公网。

