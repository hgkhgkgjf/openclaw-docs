---
title: "Hugging Face（推理）"
sidebarTitle: "Hugging Face"
description: "在 OpenClaw 中接入 Hugging Face 推理提供商：Token、模型发现、策略后缀、配置示例和路由规则。"
---

# Hugging Face（推理）

[Hugging Face 推理提供商](https://huggingface.co/docs/inference-providers)通过一个路由 API 提供 OpenAI 兼容的聊天补全。你只需要一个 Token，就可以访问 DeepSeek、Llama 等模型。

OpenClaw 目前使用它的 OpenAI 兼容端点，只接聊天补全。如果你需要文本转图像、嵌入或语音功能，请直接使用 [HF 推理客户端](https://huggingface.co/docs/api-inference/quicktour)。

- 提供商：`huggingface`
- 认证：`HUGGINGFACE_HUB_TOKEN` 或 `HF_TOKEN`。建议使用细粒度 Token，并授予 `Make calls to Inference Providers` 权限。
- API：OpenAI 兼容（`https://router.huggingface.co/v1`）
- 计费：单一 HF Token；[定价](https://huggingface.co/docs/inference-providers/pricing)遵循提供商费率，包含免费层。

---

## 快速开始

1. 在 [Hugging Face → Settings → Tokens](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained) 创建细粒度 Token，并授予 `Make calls to Inference Providers` 权限。
2. 运行引导流程，在提供商下拉菜单中选择 Hugging Face，然后在提示时输入你的 API 密钥：

```bash
openclaw onboard --auth-choice huggingface-api-key
```

3. 在“默认 Hugging Face 模型”下拉菜单中选择模型。有有效 Token 时，列表来自推理 API；否则显示内置列表。选择后会保存为默认模型。
4. 你也可以稍后在配置中设置或更改默认模型：

```json5
{
  agents: {
    defaults: {
      model: { primary: "huggingface/deepseek-ai/DeepSeek-R1" },
    },
  },
}
```

---

## 非交互式示例

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice huggingface-api-key \
  --huggingface-api-key "$HF_TOKEN"
```

这将设置 `huggingface/deepseek-ai/DeepSeek-R1` 为默认模型。

---

## 环境说明

如果 Gateway 作为守护进程运行（launchd/systemd），请确保 `HUGGINGFACE_HUB_TOKEN` 或 `HF_TOKEN` 对该进程可用（例如，在 `~/.openclaw/.env` 中或通过 `env.shellEnv`）。

---

## 模型发现和引导下拉菜单

OpenClaw 直接调用推理端点发现模型：

```bash
GET https://router.huggingface.co/v1/models
```

可以带上 `Authorization: Bearer $HUGGINGFACE_HUB_TOKEN` 或 `$HF_TOKEN` 获取更完整的列表；某些端点无认证时只返回子集。

响应是 OpenAI 风格：

```json
{ "object": "list", "data": [ { "id": "Qwen/Qwen3-8B", "owned_by": "Qwen" } ] }
```

配置了 Hugging Face API Key 后，OpenClaw 会用这个 GET 请求发现可用的聊天补全模型。交互式引导里输入 Token 后，模型下拉菜单会从这个列表填充；如果请求失败，就使用内置目录。

Gateway 启动时，只要密钥存在，OpenClaw 也会再次请求 `GET https://router.huggingface.co/v1/models` 刷新目录。刷新结果会与内置目录合并，用于补上下文窗口、费用等元数据。没有密钥或请求失败时，只使用内置目录。

---

## 模型名称和可编辑选项

- 来自 API 的名称：当 API 返回 `name`、`title` 或 `display_name` 时，模型显示名称来自 `GET /v1/models`；否则从模型 ID 派生，例如 `deepseek-ai/DeepSeek-R1` 显示为 "DeepSeek R1"。
- 覆盖显示名称：可以在配置里给模型设置自定义标签，让 CLI 和 UI 按你的叫法显示：

```json5
{
  agents: {
    defaults: {
      models: {
        "huggingface/deepseek-ai/DeepSeek-R1": { alias: "DeepSeek R1 (fast)" },
        "huggingface/deepseek-ai/DeepSeek-R1:cheapest": { alias: "DeepSeek R1 (cheap)" },
      },
    },
  },
}
```

- 提供商和策略选择：在模型 ID 后追加后缀，控制路由器怎么选后端。
  - `:fastest`：优先最高吞吐量，由路由器选择，不能再交互式选择后端。
  - `:cheapest`：优先最低输出 Token 成本，由路由器选择。
  - `:provider`：强制指定后端，例如 `:sambanova`、`:together`。

  选择 `:cheapest` 或 `:fastest` 后，提供商就被锁定，向导不会再显示“偏好特定后端”的步骤。你可以把这些变体作为单独条目加到 `models.providers.huggingface.models`，也可以直接在 `model.primary` 里使用带后缀的 ID。无后缀时，使用你在[推理提供商设置](https://hf.co/settings/inference-providers)里的默认顺序。

- 配置合并：`models.providers.huggingface.models` 里的现有条目会保留，包括 `models.json` 中的条目。自定义 `name`、`alias` 或模型选项不会被覆盖。

---

## 模型 ID 和配置示例

模型引用使用 `huggingface/<org>/<model>` 格式，也就是 Hub 风格 ID 加上 `huggingface/` 前缀。下面的列表来自 `GET https://router.huggingface.co/v1/models`；你的账号可能看到更多模型。

示例 ID：

| 模型                   | 引用（加上 `huggingface/` 前缀）    |
| ---------------------- | ----------------------------------- |
| DeepSeek R1            | `deepseek-ai/DeepSeek-R1`           |
| DeepSeek V3.2          | `deepseek-ai/DeepSeek-V3.2`         |
| Qwen3 8B               | `Qwen/Qwen3-8B`                     |
| Qwen2.5 7B Instruct    | `Qwen/Qwen2.5-7B-Instruct`          |
| Qwen3 32B              | `Qwen/Qwen3-32B`                    |
| Llama 3.3 70B Instruct | `meta-llama/Llama-3.3-70B-Instruct` |
| Llama 3.1 8B Instruct  | `meta-llama/Llama-3.1-8B-Instruct`  |
| GPT-OSS 120B           | `openai/gpt-oss-120b`               |
| GLM 4.7                | `zai-org/GLM-4.7`                   |
| Kimi K2.5              | `moonshotai/Kimi-K2.5`              |

你可以在模型 ID 后追加 `:fastest`、`:cheapest` 或 `:provider`（例如 `:together`、`:sambanova`）。在[推理提供商设置](https://hf.co/settings/inference-providers)中设置默认顺序；参见[推理提供商](https://huggingface.co/docs/inference-providers)和 GET `https://router.huggingface.co/v1/models` 获取完整列表。

### 完整配置示例

以 DeepSeek R1 为主，Qwen 为后备：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "huggingface/deepseek-ai/DeepSeek-R1",
        fallbacks: ["huggingface/Qwen/Qwen3-8B"],
      },
      models: {
        "huggingface/deepseek-ai/DeepSeek-R1": { alias: "DeepSeek R1" },
        "huggingface/Qwen/Qwen3-8B": { alias: "Qwen3 8B" },
      },
    },
  },
}
```

Qwen 为默认，同时配置 `:cheapest` 和 `:fastest` 变体：

```json5
{
  agents: {
    defaults: {
      model: { primary: "huggingface/Qwen/Qwen3-8B" },
      models: {
        "huggingface/Qwen/Qwen3-8B": { alias: "Qwen3 8B" },
        "huggingface/Qwen/Qwen3-8B:cheapest": { alias: "Qwen3 8B (cheapest)" },
        "huggingface/Qwen/Qwen3-8B:fastest": { alias: "Qwen3 8B (fastest)" },
      },
    },
  },
}
```

DeepSeek、Llama、GPT-OSS 带别名：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "huggingface/deepseek-ai/DeepSeek-V3.2",
        fallbacks: [
          "huggingface/meta-llama/Llama-3.3-70B-Instruct",
          "huggingface/openai/gpt-oss-120b",
        ],
      },
      models: {
        "huggingface/deepseek-ai/DeepSeek-V3.2": { alias: "DeepSeek V3.2" },
        "huggingface/meta-llama/Llama-3.3-70B-Instruct": { alias: "Llama 3.3 70B" },
        "huggingface/openai/gpt-oss-120b": { alias: "GPT-OSS 120B" },
      },
    },
  },
}
```

强制指定后端：

```json5
{
  agents: {
    defaults: {
      model: { primary: "huggingface/deepseek-ai/DeepSeek-R1:together" },
      models: {
        "huggingface/deepseek-ai/DeepSeek-R1:together": { alias: "DeepSeek R1 (Together)" },
      },
    },
  },
}
```

多个 Qwen 和 DeepSeek 模型带策略后缀：

```json5
{
  agents: {
    defaults: {
      model: { primary: "huggingface/Qwen/Qwen2.5-7B-Instruct:cheapest" },
      models: {
        "huggingface/Qwen/Qwen2.5-7B-Instruct": { alias: "Qwen2.5 7B" },
        "huggingface/Qwen/Qwen2.5-7B-Instruct:cheapest": { alias: "Qwen2.5 7B (cheap)" },
        "huggingface/deepseek-ai/DeepSeek-R1:fastest": { alias: "DeepSeek R1 (fast)" },
        "huggingface/meta-llama/Llama-3.1-8B-Instruct": { alias: "Llama 3.1 8B" },
      },
    },
  },
}
```
