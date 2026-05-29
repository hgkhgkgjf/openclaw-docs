---
title: "Linux server"
sidebarTitle: "Linux Server"
---

# Linux server

::: tip 先看人话
这页用于补齐 OpenClaw 官方最新文档里的新增内容。先按命令和字段原样理解；如果你只是普通用户，优先看本页的标题、小节和示例命令，不需要一口气读完所有维护者细节。
:::

Run the OpenClaw Gateway on any Linux server or cloud VPS. This page helps you
pick a provider, explains how cloud deployments work, and covers generic Linux
tuning that applies everywhere.

## Pick a provider


  - [Railway](/tutorials/installation/railway) - One-click, browser setup

  - [Northflank](/tutorials/installation/northflank) - One-click, browser setup

  - [DigitalOcean](/tutorials/installation/digitalocean) - Simple paid VPS

  - [Oracle Cloud](/tutorials/installation/oracle) - Always Free ARM tier

  - [Fly.io](/tutorials/installation/fly) - Fly Machines

  - [Hetzner](/tutorials/installation/hetzner) - Docker on Hetzner VPS

  - [Hostinger](/tutorials/installation/hostinger) - VPS with one-click setup

  - [GCP](/tutorials/installation/gcp) - Compute Engine

  - [Azure](/tutorials/installation/azure) - Linux VM

  - [exe.dev](/tutorials/installation/exe-dev) - VM with HTTPS proxy

  - [Raspberry Pi](/tutorials/installation/raspberry-pi) - ARM self-hosted


**AWS (EC2 / Lightsail / free tier)** also works well.
A community video walkthrough is available at
[x.com/techfrenAJ/status/2014934471095812547](https://x.com/techfrenAJ/status/2014934471095812547)
(community resource -- may become unavailable).

## How cloud setups work

- The **Gateway runs on the VPS** and owns state + workspace.
- You connect from your laptop or phone via the **Control UI** or **Tailscale/SSH**.
- Treat the VPS as the source of truth and **back up** the state + workspace regularly.
- Secure default: keep the Gateway on loopback and access it via SSH tunnel or Tailscale Serve.
  If you bind to `lan` or `tailnet`, require `gateway.auth.token` or `gateway.auth.password`.

Related pages: [Gateway remote access](/tutorials/gateway/remote), [Platforms hub](/tutorials/platforms).

## Harden admin access first

Before you install OpenClaw on a public VPS, decide how you want to administer
the box itself.

- If you want Tailnet-only admin access, install Tailscale first, join the VPS
  to your tailnet, verify a second SSH session over the Tailscale IP or
  MagicDNS name, then restrict public SSH.
- If you are not using Tailscale, apply the equivalent hardening for your SSH
  path before exposing more services.
- This is separate from Gateway access. You can still keep OpenClaw bound to
  loopback and use an SSH tunnel or Tailscale Serve for the dashboard.

Tailscale-specific Gateway options live in [Tailscale](/tutorials/gateway/tailscale).

## Shared company agent on a VPS

Running a single agent for a team is a valid setup when every user is in the same trust boundary and the agent is business-only.

- Keep it on a dedicated runtime (VPS/VM/container + dedicated OS user/accounts).
- Do not sign that runtime into personal Apple/Google accounts or personal browser/password-manager profiles.
- If users are adversarial to each other, split by gateway/host/OS user.

Security model details: [Security](/tutorials/gateway/security).

## Using nodes with a VPS

You can keep the Gateway in the cloud and pair **nodes** on your local devices
(Mac/iOS/Android/headless). Nodes provide local screen/camera/canvas and `system.run`
capabilities while the Gateway stays in the cloud.

Docs: [Nodes](/tutorials/nodes), [Nodes CLI](/tutorials/cli/nodes).

## Startup tuning for small VMs and ARM hosts

If CLI commands feel slow on low-power VMs (or ARM hosts), enable Node's module compile cache:

```bash
grep -q 'NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache' ~/.bashrc || cat >> ~/.bashrc <<'EOF'
export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
mkdir -p /var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1
EOF
source ~/.bashrc
```

- `NODE_COMPILE_CACHE` improves repeated command startup times.
- `OPENCLAW_NO_RESPAWN=1` keeps routine Gateway restarts in-process, which avoids extra process handoffs and keeps PID tracking simple on small hosts.
- First command run warms the cache; subsequent runs are faster.
- For Raspberry Pi specifics, see [Raspberry Pi](/tutorials/installation/raspberry-pi).

### systemd tuning checklist (optional)

For VM hosts using `systemd`, consider:

- Add service env for a stable startup path:
  - `OPENCLAW_NO_RESPAWN=1`
  - `NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache`
- Keep restart behavior explicit:
  - `Restart=always`
  - `RestartSec=2`
  - `TimeoutStartSec=90`
- Prefer SSD-backed disks for state/cache paths to reduce random-I/O cold-start penalties.

For the standard `openclaw onboard --install-daemon` path, edit the user unit:

```bash
systemctl --user edit openclaw-gateway.service
```

```ini
[Service]
Environment=OPENCLAW_NO_RESPAWN=1
Environment=NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
Restart=always
RestartSec=2
TimeoutStartSec=90
```

If you deliberately installed a system unit instead, edit
`openclaw-gateway.service` via `sudo systemctl edit openclaw-gateway.service`.

How `Restart=` policies help automated recovery:
[systemd can automate service recovery](https://www.redhat.com/en/blog/systemd-automate-recovery).

For Linux OOM behavior, child process victim selection, and `exit 137`
diagnostics, see [Linux memory pressure and OOM kills](/tutorials/platforms/linux#memory-pressure-and-oom-kills).

## Related

- [Install overview](/tutorials/installation/)
- [DigitalOcean](/tutorials/installation/digitalocean)
- [Fly.io](/tutorials/installation/fly)
- [Hetzner](/tutorials/installation/hetzner)
