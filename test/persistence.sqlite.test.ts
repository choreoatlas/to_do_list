import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"
import { SqliteTodoRepository } from "../src/persistence/sqliteTodoRepo"

// EX-sqlite: 同一 FL1–FL5 契约，SQLite 后端（测试用 :memory:，每个实例独立）
function app() {
	return createApp(new SqliteTodoRepository(":memory:"))
}

describe("SQLite 持久化后端 · 复用 FL1–FL5 契约取证", () => {
	it("FL1 创建 → 201", async () => {
		const res = await request(app()).post("/todos").send({ title: "x" })
		expect(res.status).toBe(201)
		expect(res.body.title).toBe("x")
		expect(res.body.completed).toBe(false)
	})

	it("FL1 校验失败 → 400", async () => {
		const res = await request(app()).post("/todos").send({})
		expect(res.status).toBe(400)
	})

	it("FL2 列出 → 200 且含已创建项", async () => {
		const a = app()
		await request(a).post("/todos").send({ title: "one" })
		await request(a).post("/todos").send({ title: "two" })
		const res = await request(a).get("/todos")
		expect(res.status).toBe(200)
		expect(res.body).toHaveLength(2)
	})

	it("FL3 读取存在 → 200 / 缺失 → 404", async () => {
		const a = app()
		const created = await request(a).post("/todos").send({ title: "x" })
		const ok = await request(a).get(`/todos/${created.body.id}`)
		expect(ok.status).toBe(200)
		expect(ok.body.id).toBe(created.body.id)
		const miss = await request(a).get("/todos/nope")
		expect(miss.status).toBe(404)
	})

	it("FL4 部分更新 → 200，未出现字段保留，id/createdAt 不变", async () => {
		const a = app()
		const t = (await request(a).post("/todos").send({ title: "orig" })).body
		const res = await request(a).patch(`/todos/${t.id}`).send({ completed: true })
		expect(res.status).toBe(200)
		expect(res.body.completed).toBe(true)
		expect(res.body.title).toBe("orig")
		expect(res.body.id).toBe(t.id)
		expect(res.body.createdAt).toBe(t.createdAt)
	})

	it("FL4 空 patch → 400", async () => {
		const a = app()
		const t = (await request(a).post("/todos").send({ title: "orig" })).body
		const res = await request(a).patch(`/todos/${t.id}`).send({})
		expect(res.status).toBe(400)
	})

	it("FL5 删除 → 204，再 GET → 404", async () => {
		const a = app()
		const t = (await request(a).post("/todos").send({ title: "x" })).body
		const del = await request(a).delete(`/todos/${t.id}`)
		expect(del.status).toBe(204)
		const get = await request(a).get(`/todos/${t.id}`)
		expect(get.status).toBe(404)
	})
})
