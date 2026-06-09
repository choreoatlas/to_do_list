# to_do_list

close_loop 治理下的 **todo-api**。

本仓库是 close_loop 系统中的 *material truth*（真实代码 / commit / CI）；治理记录（loop 记录真相）保存在 Notion 的 **Loops 账本**。

## 架构（三层闭环）

```
material truth (Git / CI / DB)
  → execution_loop（实现载体）
  → function_loop（能力路径，多对多）
  → governance_loop（准入治理）
```

### function_loop（5 条能力路径）

| # | function_loop | 典型 execution_loop 组合 | 契约要点 |
|---|---|---|---|
| FL1 | 创建待办 | route + validation + persistence + model | 输入→校验→持久化→返回实体 |
| FL2 | 查询列表 | route + persistence + model | 过滤 / 分页 / 排序 |
| FL3 | 读取单条 | route + persistence + model | 未命中返回 404 |
| FL4 | 更新待办 | route + validation + persistence + model | 校验后持久化 |
| FL5 | 删除待办 | route + persistence | 幂等 + 返回码契约 |

### execution_loop（实现载体 / 目录）

- `src/route` — EL-route：HTTP handlers，被 FL1–FL5 全部引用
- `src/validation` — EL-validation：输入校验，仅 FL1 / FL4 引用
- `src/persistence` — EL-persistence：存储访问层，被 FL1–FL5 全部引用
- `src/model` — EL-model：数据模型 / schema，被全部读写路径引用

## 技术栈

Node.js + Express + TypeScript（默认；S2 起落地实现）。

## 治理状态

当前：`not_admitted`（真实基线尚未准入）。

准入门（baseline）：仓库初始化 + 栈锁定 + FL1–FL5 最小实现与测试 + CI 通过 + 账本留痕，且由维护者签收。

## 操作模型

单操作者轮换三身份：Dev Driver（推进实现）/ Flow Steward（处理异常）/ Gate Owner（判定准入）。合并进 `main` 与基线准入由维护者拍板。

## Slices

- **S1**：仓库初始化（README + .gitignore + LICENSE + 四层目录骨架）。← 本 PR
