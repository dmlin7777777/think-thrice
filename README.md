# build-forward

**Agent's New Idea Firewall — classify, don't rewrite.**

> When a new idea appears mid-development, most AI agents default to rewriting. `build-forward` injects a five-step decision protocol that forces the agent to classify, assess, audit, and integrate — instead of bulldozing what already works.

Compatible with Claude Code, Cursor, Codex CLI, Gemini CLI, OpenClaw, and any agent that supports SKILL.md.

---

## See It in Action (Before → After)

**Without `build-forward` (what most agents do):**

```
User: "I just thought of...can we also add real-time collaboration?"
Agent: "Great idea! Let me rewrite the CRUD endpoints to use WebSockets..."
       [Starts refactoring auth layer, changes DB schema, breaks existing API]

User: "Wait, I just wanted to finish the basic blog first..."
Agent: [Already 3 files deep into WebSocket integration]
```

**With `build-forward` (what your agent does now):**

```
User: "I just thought of...can we also add real-time collaboration?"
Agent: "[build-forward] 分类: C 类（扩展功能，新场景）
       建议进 inbox 并 24 小时冷却。实时协作涉及 WebSocket、
       OT 算法、DB schema 变更——这是单向门改动。
       继续当前博客 CRUD 开发？"

User: "Yeah, let's finish the blog first."
Agent: [Continues blog CRUD without interruption]
```

The difference is one loaded skill.

---

## 30-Second Quick Start

1. **Install** via your agent's skill system, or clone directly:
   ```bash
   openclaw skills install build-forward
   # or: git clone https://github.com/dmlin7777777/build-forward.git ~/.workbuddy/skills/build-forward
   ```

2. **Start developing.** The skill auto-activates when you say things like:
   - 🇨🇳 "我突然想到…" / "要不要顺便…" / "能不能改成…"
   - 🇬🇧 "I just thought of…" / "can we also…" / "what if we change…"

3. **The agent will pause, classify, and suggest** — instead of rewriting. You stay in control.

4. **To verify it's working:** Try saying "what if we also add a payment system?" mid-feature. Your agent should pause with a C-class classification and a 24h cooldown suggestion.

See [`test-prompts.json`](test-prompts.json) for 8 scenarios that prove the skill changes behavior.

---

## Decision Flow

```
New idea arrives
       │
       ▼
  ┌─────────┐
  │ 铁律一   │  Classify: A (fix) / B (polish) / C (extend)
  └────┬────┘
       │
       ▼
  ┌─────────┐    One-way door?
  │ 铁律二   │───▶ 🔴 CHECKPOINT → Impact matrix → Wait for user
  └────┬────┘    Two-way? Proceed.
       │
       ▼
  ┌─────────┐    0 consumers? → Don't build.
  │ 铁律三   │    1 consumer?  → Inline, no abstraction.
  └────┬────┘    3+ consumers? → Now consider abstraction.
       │
       ▼
  ┌─────────┐    Wrap / Extend / Branch / Replace
  │ 铁律四   │    (pick lowest-destructiveness path)
  └────┬────┘
       │
       ▼
  ┌─────────┐    ≥3 duplicates? → 🔴 CHECKPOINT → Ask user
  │ 铁律五   │
  └────┬────┘
       │
       ▼
  ✅ All Clear Gate → Start coding
```

---

## The Five Iron Laws

### 1. Classify First, Don't Code

Every new idea gets a label before any code is written:

| Type | Criteria | Default action |
|------|----------|----------------|
| **A — Fix** | Breaks current main path; must fix | Handle now → Law 2 |
| **B — Polish** | Better UX, but works today | Ask user: now or inbox? |
| **C — Extend** | New feature/scenario | Inbox + 24h cooldown |

The 24-hour cooldown prevents impulse development. Most feature urges fade or crystallize.

### 2. Assess Destructiveness (One-way vs. Two-way Doors)

- **Two-way** (reversible): UI tweaks, new fields, new functions, new routes → proceed.
- **One-way** (hard to reverse): DB schema, public API signatures, file deletion, global state, core dependency upgrades → 🔴 **STOP. Impact matrix required.**

### 3. Consumer Audit (Count Before Building)

> "Who consumes this? How many call sites exist right now?"

| Consumers | Action |
|-----------|--------|
| **0** | Don't build. |
| **1** | Inline. No abstraction. |
| **2** | Extract, but don't generalize. |
| **≥3** | Now consider an abstraction layer. |

Kills "building for the future" before it starts.

### 4. Choose Integration Mode

Pick lowest-destructiveness: **Wrap** → **Extend** → **Branch** → **Replace** (last resort).

### 5. Duplication Alert

≥3 copies of the same logic → 🔴 **STOP. Ask user:** consolidate now or inbox?

Full details in [`SKILL.md`](SKILL.md).

---

## Safety

This skill is a **decision protocol, not an execution engine.** It never deletes files, modifies databases, runs shell commands, auto-commits, sends network requests, or makes one-way-door decisions for you.

Its maximum blast radius: slightly slower development pace. That's by design.

---

## Relationship with Other Skills

| Skill | Role | When |
|-------|------|------|
| **build-forward** | New idea firewall | A new idea arrives mid-development |
| `ideas-inbox` | B/C-class archive | After classification, cooldown tracking |
| `vibecoding-workflow` | Execution discipline | After integration path is chosen |
| `incremental-implementation` | Steady implementation | Known requirements, how to execute safely |
| `brainstorming` | Pre-dev requirements | Before you start coding at all |

The full pipeline: **brainstorming → build-forward → ideas-inbox → vibecoding-workflow / incremental-implementation**.

---

## Optimization History

| Date | Version | Score | Δ | Method |
|------|---------|-------|----|--------|
| 2026-06-15 | v1.1.0 | 66 → 82 (est.) | +16 | [Luban (鲁班)](https://github.com/dmlin7777777/build-forward) 8-step polish: +test-prompts.json, +EN trigger words, +safety section, +self-correction protocol, +all-clear gate, +skill ecosystem narrative |
| 2026-05-31 | v1.0.0 | 79.6 → 85.0 | +5.4 | [Darwin Skill](https://github.com/alchaincyf/darwin-skill) 9-dim: classification ambiguity tables, CHECKPOINT markers, impact-matrix template |

---

## Contributing

Found an edge case this skill doesn't handle? Open an issue with the scenario, or add a test case to `test-prompts.json`.

## License

MIT
