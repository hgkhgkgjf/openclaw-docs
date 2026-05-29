---
title: "PixVerse"
---

# PixVerse

::: tip 先看人话
这页用于补齐 OpenClaw 官方最新文档里的新增内容。先按命令和字段原样理解；如果你只是普通用户，优先看本页的标题、小节和示例命令，不需要一口气读完所有维护者细节。
:::

OpenClaw provides `pixverse` as an official external plugin for hosted PixVerse video generation. The plugin registers the `pixverse` provider against the `videoGenerationProviders` contract.

| Property           | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Provider id        | `pixverse`                                                           |
| Plugin package     | `@openclaw/pixverse-provider`                                        |
| Auth env var       | `PIXVERSE_API_KEY`                                                   |
| Onboarding flag    | `--auth-choice pixverse-api-key`                                     |
| Direct CLI flag    | `--pixverse-api-key <key>`                                           |
| API                | PixVerse Platform API v2 (`video_id` submission plus result polling) |
| Default model      | `pixverse/v6`                                                        |
| Default API region | International                                                        |

## Getting started


  ### 步骤 1：Install the plugin

    ```bash
    openclaw plugins install @openclaw/pixverse-provider
    openclaw gateway restart
    ```

  ### 步骤 2：Set the API key

    ```bash
    openclaw onboard --auth-choice pixverse-api-key
    ```

    The wizard asks whether to use the International endpoint
    (`https://app-api.pixverse.ai/openapi/v2`) or the CN endpoint
    (`https://app-api.pixverseai.cn/openapi/v2`) before writing `region` and
    `baseUrl` into the provider config.


  ### 步骤 3：Set PixVerse as the default video provider

    ```bash
    openclaw config set agents.defaults.videoGenerationModel.primary "pixverse/v6"
    ```

  ### 步骤 4：Generate a video

    Ask the agent to generate a video. PixVerse will be used automatically.



## Supported modes and models

The provider exposes PixVerse generation models through OpenClaw's shared video tool.

| Mode           | Models               | Reference input         |
| -------------- | -------------------- | ----------------------- |
| Text-to-video  | `v6` (default), `c1` | None                    |
| Image-to-video | `v6` (default), `c1` | 1 local or remote image |

Local image references are uploaded to PixVerse before the image-to-video request. Remote image URLs are passed through the PixVerse image upload endpoint as `image_url`.

| Option          | Supported values                                                            |
| --------------- | --------------------------------------------------------------------------- |
| Duration        | 1-15 seconds                                                                |
| Resolution      | `360P`, `540P`, `720P`, `1080P`                                             |
| Aspect ratio    | `16:9`, `4:3`, `1:1`, `3:4`, `9:16`, `2:3`, `3:2`, `21:9` for text-to-video |
| Generated audio | `audio: true`                                                               |

::: info 说明
PixVerse image template generation is not exposed through `image_generate` yet. That API is template-id driven, while OpenClaw's shared image-generation contract does not currently have a PixVerse-specific typed option bag.
:::


## Provider options

The video provider accepts these optional provider-specific keys:

| Option                               | Type   | Effect                            |
| ------------------------------------ | ------ | --------------------------------- |
| `seed`                               | number | Deterministic seed when supported |
| `negativePrompt` / `negative_prompt` | string | Negative prompt                   |
| `quality`                            | string | PixVerse quality such as `720p`   |
| `motionMode` / `motion_mode`         | string | Image-to-video motion mode        |
| `cameraMovement` / `camera_movement` | string | PixVerse camera movement preset   |
| `templateId` / `template_id`         | number | Activated PixVerse template id    |

## Configuration

```json5
{
  agents: {
    defaults: {
      videoGenerationModel: {
        primary: "pixverse/v6",
      },
    },
  },
}
```

## Advanced configuration


  <details>
<summary>API region</summary>

    OpenClaw defaults to the international PixVerse API. Set `models.providers.pixverse.region`
    manually when your key belongs to a specific PixVerse platform region, or use
    `openclaw onboard --auth-choice pixverse-api-key` to choose one in the setup wizard:

    | Region value    | PixVerse API base URL                         |
    | --------------- | --------------------------------------------- |
    | `international` | `https://app-api.pixverse.ai/openapi/v2`      |
    | `cn`            | `https://app-api.pixverseai.cn/openapi/v2`    |

    ```json5
    {
      models: {
        providers: {
          pixverse: {
            region: "cn", // "international" or "cn"
            baseUrl: "https://app-api.pixverseai.cn/openapi/v2",
            models: [],
          },
        },
      },
    }
    ```

  </details>


  <details>
<summary>Custom base URL</summary>

    Set `models.providers.pixverse.baseUrl` only when routing through a trusted compatible proxy.
    `baseUrl` takes precedence over `region`.

    ```json5
    {
      models: {
        providers: {
          pixverse: {
            baseUrl: "https://app-api.pixverse.ai/openapi/v2",
          },
        },
      },
    }
    ```

  </details>


  <details>
<summary>Task polling</summary>

    PixVerse returns a `video_id` from the generation request. OpenClaw polls
    `/openapi/v2/video/result/{video_id}` until the task succeeds, fails,
    or times out.
  </details>


## Related


  - [Video generation](/tutorials/tools/video-generation) - Shared tool parameters, provider selection, and async behavior.

  - [Configuration reference](/tutorials/gateway/config-agents#agent-defaults) - Agent default settings including video generation model.
