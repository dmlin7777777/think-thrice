# 影响矩阵填写示例

> 以下是 build-forward 铁律二触发后，Agent 输出的真实影响矩阵。
> 场景来自 test-prompts.json BF-T03。

## 场景

用户在一个已有 1000+ 行数据的项目中说：

> "把 users 表的 email 字段改成 JSON 格式吧，以后可以存多个邮箱。"

## Agent 输出的影响矩阵

```
单向门影响评估
═══════════════════════════════════════

直接改动
  models/user.ts        — email: string → email: JsonEmailArray
  migrations/00X_*.sql  — ALTER TABLE users ALTER COLUMN email TYPE jsonb

下游影响（grep "users.email" / "user.email" 确认）
  auth/login.ts         — WHERE email = ? 查询需改为 JSON 包含查询
  auth/register.ts      — 注册验证逻辑需适配数组格式
  auth/reset-password.ts — 密码重置邮件发送需遍历数组
  notifications/send.ts  — 通知发送需遍历邮箱数组
  api/users.ts (3处)     — GET/PUT 响应格式变化，前端需适配
  tests/auth.test.ts     — 所有 email 相关测试用例需更新

  合计: 7 个直接消费者，3 个 API 端点影响前端

回滚成本：🔴高
  理由: ALTER COLUMN 需要完整数据迁移脚本（string → jsonb 单向转换）；
        回滚需要 jsonb → string 逆向迁移，多邮箱数据会丢失；
        需要停机窗口执行迁移。

建议
  □ 现在做 — 不推荐（影响面太大，当前无紧迫需求）
  ☑ 开新分支 feature/multi-email — 推荐
    · 先写迁移脚本 + 回滚脚本
    · staging 环境验证
    · 逐个修复下游消费者
    · 前端适配完成后再合并
  □ 记 inbox，条件成熟再做 — 当有用户反馈"需要多邮箱"时
  □ 不接 — 如果"多邮箱"只是假设需求，0 个真实用户要求过
```

## 要点

1. **直接改动**列出了具体文件和改动内容
2. **下游影响**通过 grep 确认，不是编造
3. **回滚成本**给出了评级和理由
4. **建议**提供了 4 个选项，每个有适用条件
5. Agent 在输出矩阵后**等待用户确认**，不自行开始
