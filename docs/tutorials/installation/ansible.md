---
title: "Ansible"
sidebarTitle: "Ansible"
description: "用 openclaw-ansible 把 OpenClaw 部署到生产服务器，包含 Tailscale、UFW、Docker 沙箱、systemd 服务和排障命令。"
---

# Ansible 安装

如果要把 OpenClaw 放到生产服务器上长期运行，推荐使用 [openclaw-ansible](https://github.com/openclaw/openclaw-ansible)。它会把网关、远程访问、防火墙和沙箱环境一起配置好。

---

## 快速开始

一条命令安装：

```bash
curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw-ansible/main/install.sh | bash
```

> 完整指南：[github.com/openclaw/openclaw-ansible](https://github.com/openclaw/openclaw-ansible)
>
> openclaw-ansible 仓库是 Ansible 部署的权威来源。本页面仅为快速概览。

---

## 你将获得

- UFW 防火墙和 Docker 隔离；默认只开放 SSH 与 Tailscale 所需入口。
- Tailscale VPN；不需要把 Gateway 暴露到公网。
- Docker 沙箱容器；工具执行在隔离环境里完成。
- systemd 服务；开机自启动，并带基础加固。
- 一条命令完成主要部署步骤。

---

## 系统要求

- Debian 11+ 或 Ubuntu 20.04+。
- root 或 sudo 权限。
- 能访问互联网，用于安装系统包和拉取依赖。
- Ansible 2.14+。快速安装脚本会自动安装。

---

## 安装内容

Ansible playbook 会安装并配置以下内容：

1. Tailscale：用于安全远程访问的 mesh VPN。
2. UFW 防火墙：只开放 SSH 与 Tailscale 端口。
3. Docker CE + Compose V2：用于智能体沙箱。
4. Node.js 22.x + pnpm：OpenClaw 运行时依赖。
5. OpenClaw：安装在主机上，不放进 Gateway 容器。
6. systemd 服务：负责自启动和基础加固。

注意：Gateway 直接跑在主机上，不在 Docker 里。Docker 用来隔离 Agent 沙箱。详见[沙箱](/tutorials/gateway/sandboxing)。

---

## 安装后设置

安装完成后，切换到 openclaw 用户：

```bash
sudo -i -u openclaw
```

安装后脚本将引导你完成：

1. 引导向导：配置 OpenClaw。
2. 提供商登录：连接 WhatsApp、Telegram、Discord、Signal。
3. Gateway 测试：确认服务能正常启动和响应。
4. Tailscale 设置：把服务器接入你的 VPN 网络。

### 常用命令

```bash
# 检查服务状态
sudo systemctl status openclaw

# 查看实时日志
sudo journalctl -u openclaw -f

# 重启网关
sudo systemctl restart openclaw

# 提供商登录（以 openclaw 用户运行）
sudo -i -u openclaw
openclaw channels login
```

---

## 安全架构

### 4 层防御

1. UFW 防火墙：公网只开放 SSH (22) 和 Tailscale (41641/udp)。
2. Tailscale VPN：Gateway 只通过 VPN 网络访问。
3. Docker 隔离：`DOCKER-USER` iptables 链阻止外部端口暴露。
4. systemd 加固：使用 `NoNewPrivileges`、`PrivateTmp` 和非特权用户。

### 验证

测试外部攻击面：

```bash
nmap -p- YOUR_SERVER_IP
```

正常情况下，只应该看到 22 端口开放。Gateway 和 Docker 暴露面应被锁住。

### Docker 可用性

Docker 用于 Agent 沙箱，也就是隔离工具执行；它不负责运行 Gateway。Gateway 只绑定 localhost，通过 Tailscale VPN 访问。

参见 [多智能体沙箱与工具](/tutorials/tools/multi-agent-sandbox-tools) 了解沙箱配置。

---

## 手动安装

如果你更希望手动控制而非自动化：

```bash
# 1. 安装前置依赖
sudo apt update && sudo apt install -y ansible git

# 2. 克隆仓库
git clone https://github.com/openclaw/openclaw-ansible.git
cd openclaw-ansible

# 3. 安装 Ansible 集合
ansible-galaxy collection install -r requirements.yml

# 4. 运行 playbook
./run-playbook.sh

# 或直接运行（然后手动执行 /tmp/openclaw-setup.sh）
# ansible-playbook playbook.yml --ask-become-pass
```

---

## 更新 OpenClaw

Ansible 安装器会将 OpenClaw 设置为手动更新。参见 [更新](/tutorials/installation/updating) 了解标准更新流程。

要重新运行 Ansible playbook（例如用于配置变更）：

```bash
cd openclaw-ansible
./run-playbook.sh
```

这个操作是幂等的，可以安全重复运行。

---

## 故障排除

### 防火墙阻止了我的连接

如果你被锁在外面：

- 先确认你能通过 Tailscale VPN 访问服务器。
- SSH 端口 22 默认允许。
- Gateway 只能通过 Tailscale 访问，这是预期行为，不是防火墙误拦。

### 服务无法启动

```bash
# 检查日志
sudo journalctl -u openclaw -n 100

# 验证权限
sudo ls -la /opt/openclaw

# 测试手动启动
sudo -i -u openclaw
cd ~/openclaw
pnpm start
```

### Docker 沙箱问题

```bash
# 验证 Docker 是否运行
sudo systemctl status docker

# 检查沙箱镜像
sudo docker images | grep openclaw-sandbox

# 如果缺少沙箱镜像则构建
cd /opt/openclaw/openclaw
sudo -u openclaw ./scripts/sandbox-setup.sh
```

### 提供商登录失败

确保你以 `openclaw` 用户身份运行：

```bash
sudo -i -u openclaw
openclaw channels login
```

---

## 高级配置

有关详细的安全架构和故障排除：

- [安全架构](https://github.com/openclaw/openclaw-ansible/blob/main/docs/security.md)
- [技术细节](https://github.com/openclaw/openclaw-ansible/blob/main/docs/architecture.md)
- [故障排除指南](https://github.com/openclaw/openclaw-ansible/blob/main/docs/troubleshooting.md)

---

## 相关链接

- [openclaw-ansible](https://github.com/openclaw/openclaw-ansible)：完整部署指南。
- [Docker](/tutorials/installation/docker)：容器化 Gateway 设置。
- [沙箱](/tutorials/gateway/sandboxing)：Agent 沙箱配置。
- [多智能体沙箱与工具](/tutorials/tools/multi-agent-sandbox-tools)：按 Agent 隔离工具执行。
