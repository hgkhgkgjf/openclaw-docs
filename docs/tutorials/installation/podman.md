---
title: "Podman"
sidebarTitle: "Podman"
description: "用 rootless Podman 运行 OpenClaw Gateway，包含一次性安装、Quadlet 服务、专用用户、环境变量和排障命令。"
---

# Podman

这一页讲怎么用 rootless Podman 跑 OpenClaw Gateway。镜像仍然来自官方仓库的 [Dockerfile](https://github.com/openclaw/openclaw/blob/main/Dockerfile)，只是运行方式换成 Podman。

---

## 系统要求

- Podman，建议使用 rootless 模式。
- 第一次设置需要 sudo，用来创建 `openclaw` 用户、构建镜像和安装启动脚本。

---

## 快速开始

第一步，在仓库根目录运行一次安装脚本：

```bash
./setup-podman.sh
```

脚本会创建专用用户、构建镜像、安装启动脚本，并写入一个最小配置文件：

```text
~openclaw/.openclaw/openclaw.json
```

这个配置会把 `gateway.mode` 设为 `local`。有了它，Gateway 不需要先跑完整向导也能启动。

默认安装只准备容器和脚本，不会注册成 systemd 服务。如果你希望开机自启，并让 systemd 负责重启，使用 Quadlet：

```bash
./setup-podman.sh --quadlet
```

也可以设置 `OPENCLAW_PODMAN_QUADLET=1`。如果只想安装容器和启动脚本，使用 `--container`。

第二步，手动启动 Gateway 做一次冒烟测试：

```bash
./scripts/run-openclaw-podman.sh launch
```

第三步，如果需要添加通道或模型提供商，再进入 setup：

```bash
./scripts/run-openclaw-podman.sh launch setup
```

完成后打开：

```text
http://127.0.0.1:18789/
```

登录 Token 在 `~openclaw/.openclaw/.env` 里，安装脚本通常也会在终端里打印一次。

---

## Systemd（Quadlet，可选）

如果你运行了 `./setup-podman.sh --quadlet`，或设置了 `OPENCLAW_PODMAN_QUADLET=1`，脚本会安装一个 [Podman Quadlet](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html) 单元。Gateway 会作为 `openclaw` 用户的 systemd 用户服务运行，并在安装结束时启动。

常用命令：

```bash
sudo systemctl --machine openclaw@ --user start openclaw.service
sudo systemctl --machine openclaw@ --user stop openclaw.service
sudo systemctl --machine openclaw@ --user status openclaw.service
sudo journalctl --machine openclaw@ --user -u openclaw.service -f
```

Quadlet 文件在：

```text
~openclaw/.config/containers/systemd/openclaw.container
```

要改端口或环境变量，编辑这个文件，或编辑它引用的 `.env`。改完以后重新加载并重启服务：

```bash
sudo systemctl --machine openclaw@ --user daemon-reload
sudo systemctl --machine openclaw@ --user restart openclaw.service
```

如果系统给 `openclaw` 用户启用了 lingering，服务会随系统启动。`setup-podman.sh` 会在 `loginctl` 可用时自动处理。

要在初始设置未使用 quadlet 的情况下添加 quadlet，重新运行：`./setup-podman.sh --quadlet`。

---

## openclaw 用户（非登录）

`setup-podman.sh` 会创建一个专用系统用户 `openclaw`。这个用户只负责运行 Gateway，不给人日常登录用。

- Shell 是 `nologin`，不能交互式登录，攻击面更小。
- Home 通常是 `/home/openclaw`，里面放 `~/.openclaw` 配置、工作区和 `run-openclaw-podman.sh`。
- rootless Podman 需要 `subuid` 和 `subgid`。很多发行版会自动分配；如果脚本打印警告，在 `/etc/subuid` 和 `/etc/subgid` 中添加这一行：

  ```text
  openclaw:100000:65536
  ```

  然后用这个用户启动 Gateway，例如：

  ```bash
  sudo -u openclaw /home/openclaw/run-openclaw-podman.sh
  sudo -u openclaw /home/openclaw/run-openclaw-podman.sh setup
  ```

只有 `openclaw` 和 root 可以访问 `/home/openclaw/.openclaw`。配置可以在控制面板里改，也可以直接编辑：

```bash
sudo -u openclaw $EDITOR /home/openclaw/.openclaw/openclaw.json
```

---

## 环境变量和配置

- Token 存在 `~openclaw/.openclaw/.env`，变量名是 `OPENCLAW_GATEWAY_TOKEN`。如果缺失，`setup-podman.sh` 和 `run-openclaw-podman.sh` 会用 `openssl`、`python3` 或 `od` 生成一个。
- 你也可以在 `.env` 里放模型提供商密钥，例如 `GROQ_API_KEY`、`OLLAMA_API_KEY`，以及其他 OpenClaw 环境变量。
- 默认主机端口是 `18789`（Gateway）和 `18790`（bridge）。启动时可用 `OPENCLAW_PODMAN_GATEWAY_HOST_PORT` 和 `OPENCLAW_PODMAN_BRIDGE_HOST_PORT` 覆盖。
- 默认配置目录和工作区是 `~openclaw/.openclaw`、`~openclaw/.openclaw/workspace`。如需换路径，设置 `OPENCLAW_CONFIG_DIR` 和 `OPENCLAW_WORKSPACE_DIR`。

---

## 常用命令

| 要做什么 | Quadlet | 脚本或 Podman |
|----------|---------|---------------|
| 看日志 | `sudo journalctl --machine openclaw@ --user -u openclaw.service -f` | `sudo -u openclaw podman logs -f openclaw` |
| 停止 | `sudo systemctl --machine openclaw@ --user stop openclaw.service` | `sudo -u openclaw podman stop openclaw` |
| 启动 | `sudo systemctl --machine openclaw@ --user start openclaw.service` | 重新运行启动脚本，或 `podman start openclaw` |
| 移除容器 | 不适用 | `sudo -u openclaw podman rm -f openclaw` |

移除容器不会删除主机上的配置和工作区。

---

## 故障排除

- 配置或认证文件报 `EACCES`：容器默认使用 `--userns=keep-id`，会用运行脚本的主机 uid/gid 访问挂载目录。确认 `OPENCLAW_CONFIG_DIR` 和 `OPENCLAW_WORKSPACE_DIR` 属于这个用户。
- Gateway 因缺少 `gateway.mode=local` 启动失败：确认 `~openclaw/.openclaw/openclaw.json` 存在，并包含 `gateway.mode="local"`。脚本会在文件缺失时创建它。
- `openclaw` 用户的 rootless Podman 启动失败：检查 `/etc/subuid` 和 `/etc/subgid` 是否有 `openclaw:100000:65536` 这类记录。补上后重新启动。
- 容器名已被使用：启动脚本使用 `podman run --replace`，一般会自动替换。手动清理可运行 `podman rm -f openclaw`。
- 以 `openclaw` 用户运行时找不到脚本：确认已运行 `setup-podman.sh`，并检查 `/home/openclaw/run-openclaw-podman.sh` 是否存在。
- Quadlet 服务找不到或启动失败：编辑 `.container` 文件后先运行 `sudo systemctl --machine openclaw@ --user daemon-reload`。Quadlet 需要 cgroups v2，下面命令应输出 `2`：

  <code v-pre>podman info --format '<span v-pre>\{\{.Host.CgroupsVersion\}\}</span>'</code>

---

## 可选：以你自己的用户运行

也可以不用专用 `openclaw` 用户，直接用你的普通用户运行。流程是：构建镜像，创建包含 `OPENCLAW_GATEWAY_TOKEN` 的 `~/.openclaw/.env`，然后用 `--userns=keep-id` 挂载你的 `~/.openclaw`。

启动脚本主要面向专用用户流程。单用户部署时，可以参考脚本里的 `podman run` 命令，把配置目录和工作区改到你的主目录。

大多数长期运行场景仍建议用 `setup-podman.sh` 创建专用用户。配置、权限和进程边界都更清楚。
