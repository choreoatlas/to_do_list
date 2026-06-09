# EL-route

HTTP 路由与处理器层。调用顺序：route → validation → model → persistence。

- **S2 / FL1**：`POST /todos` 创建待办（已实现）。
- 后续：FL2 list / FL3 read / FL4 update / FL5 delete。
