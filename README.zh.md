# build-forward

**Agent 的新想法防火墙 — 先分类，不推倒。**

> 当新想法在开发中途出现时，大多数 AI Agent 的默认反应是推倒重写。`build-forward` 注入五步决策协议，强制 Agent 先分类、评估、审计，再接入——而非推平已有的成果。

兼容 Claude Code、Cursor、Codex CLI、Gemini CLI、OpenClaw，以及任何支持 SKILL.md 的 Agent。

---

## 加载前后对比

**没有 `build-forward`（大多数 Agent 的默认行为）：**

```
用户："我突然想到……能不能加个实时协作功能？"
Agent："好主意！让我把 CRUD 接口重写成 WebSocket……"
       [开始重构认证层、改数据库 schema、破坏现有 API]

用户："等等，我只是想先把基础博客做完……"
Agent：[已经把 3 个文件改得面目全非]
```

**有 `build-forward`（加载后的 Agent 行为）：**

```
用户："我突然想到……能不能加个实时协作功能？"
Agent："[build-forward] 分类：C 类（扩展功能，新场景）
       建议进 inbox 并 24 小时冷却。实时协作涉及 WebSocket、
       OT 算法、DB schema 变更——这是单向门改动。
       继续当前博客 CRUD 开发？"

用户："对，先把博客做完。"
Agent：[不受干扰，继续博客 CRUD]
```

就是一个 Skill 的区别。

---

## 30 秒快速开始

1. **安装**：
   ```bash
   openclaw skills install build-forward
   # 或: git clone https://github.com/dmlin7777777/build-forward.git ~/.workbuddy/skills/build-forward
   ```

2. **正常开发**。当你说以下关键词时，Skill 自动触发：
   - 🇨🇳 "我突然想到…" / "要不要顺便…" / "能不能改成…"
   - 🇬🇧 "I just thought of…" / "can we also…" / "what if we change…"

3. **Agent 会暂停、分类、建议**——而非重写一切。控制权始终在你手里。

4. **验证是否生效**：开发中途试着说"要不要顺便加个支付系统？" Agent 应该输出 C 类分类 + 24 小时冷却建议。

详见 [`test-prompts.json`](test-prompts.json) 中的 8 个验证场景。

---

## 决策流程

```
新想法到达
       │
       ▼
  ┌─────────┐
  │ 铁律一   │  分类: A（堵漏）/ B（优化）/ C（扩展）
  └────┬────┘
       │
       ▼
  ┌─────────┐   单向门？
  │ 铁律二   │───▶ 🔴 CHECKPOINT → 影响矩阵 → 等用户确认
  └────┬────┘   双向门？继续。
       │
       ▼
  ┌─────────┐   0 个消费者？→ 不建。
  │ 铁律三   │   1 个消费者？→ 最简实现，不抽象。
  └────┬────┘   3+ 个消费者？→ 才考虑抽象。
       │
       ▼
  ┌─────────┐   Wrap / Extend / Branch / Replace
  │ 铁律四   │   （选破坏性最低的路径）
  └────┬────┘
       │
       ▼
  ┌─────────┐   ≥3 次重复？→ 🔴 CHECKPOINT → 问用户
  │ 铁律五   │
  └────┬────┘
       │
       ▼
  ✅ 最终确认门 → 开始写代码
```

---

## 五条铁律概要

### 1. 先分类，不动手
A（堵漏）→ 现在修 | B（优化）→ 问用户 | C（扩展）→ inbox + 24h 冷却

### 2. 评估破坏性
双向门（可逆）→ 继续 | 单向门（难反悔）→ 🔴 STOP，输出影响矩阵

### 3. 消费者审计
0 → 不建 | 1 → 内联 | 2 → 可提取 | ≥3 → 才考虑抽象

### 4. 选接入模式
Wrap → Extend → Branch → Replace（破坏性从低到高，Replace 是最后手段）

### 5. 重复报警
同一逻辑 ≥3 次 → 🔴 STOP，问用户：现在统一还是记 inbox？

完整协议见 [`SKILL.md`](SKILL.md)。

---

## 安全声明

本 Skill 是**决策协议，不是执行引擎**。它不会删除文件、不会修改数据库、不会执行 shell 命令、不会自动 commit、不会发送网络请求、不会替你决定单向门操作。

最大破坏半径：略微降低开发节奏。这是设计意图，不是 bug。

---

## 与同类 Skill 的关系

| Skill | 角色 | 时机 |
|-------|------|------|
| **build-forward** | 新想法防火墙 | 开发中途新想法到达时 |
| `ideas-inbox` | B/C 类归档 | 分类后冷却跟踪 |
| `vibecoding-workflow` | 执行纪律 | 接入路径确定后 |
| `incremental-implementation` | 分步实现 | 已知需求，如何安全执行 |
| `brainstorming` | 需求澄清 | 开始写代码之前 |

完整链路：**brainstorming → build-forward → ideas-inbox → vibecoding-workflow / incremental-implementation**。

---

## 优化记录

| 日期 | 版本 | 评分 | Δ | 方法 |
|------|------|------|----|------|
| 2026-06-15 | v1.1.0 | 66 → 82（估） | +16 | [鲁班](https://github.com/dmlin7777777/build-forward) 八步打磨：+test-prompts.json、+英文触发词、+安全边界、+自纠正协议、+最终确认门、+Skill 生态叙事 |
| 2026-05-31 | v1.0.0 | 79.6 → 85.0 | +5.4 | [Darwin Skill](https://github.com/alchaincyf/darwin-skill) 9 维评估：分类模糊表、CHECKPOINT 标记、影响矩阵模板 |

---

## 参与贡献

发现 Skill 无法处理的边界场景？提 Issue 附上场景描述，或直接往 `test-prompts.json` 加测试用例。

## 许可证

MIT
