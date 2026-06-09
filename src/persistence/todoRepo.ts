// EL-persistence: storage / data access (in-memory for now; serves FL1–FL5)
import type { Todo } from "../model/todo"

export interface UpdateTodoPatch {
	title?: string
	completed?: boolean
}

export interface TodoRepository {
	create(todo: Todo): Todo
	list(): Todo[]
	getById(id: string): Todo | undefined
	update(id: string, patch: UpdateTodoPatch): Todo | undefined
	delete(id: string): boolean
}

export class InMemoryTodoRepository implements TodoRepository {
	private readonly store = new Map<string, Todo>()

	create(todo: Todo): Todo {
		this.store.set(todo.id, todo)
		return todo
	}

	list(): Todo[] {
		return Array.from(this.store.values())
	}

	getById(id: string): Todo | undefined {
		return this.store.get(id)
	}

	update(id: string, patch: UpdateTodoPatch): Todo | undefined {
		const existing = this.store.get(id)
		if (!existing) return undefined
		// 部分合并：仅更新出现的字段；id / createdAt 不变
		const updated: Todo = {
			...existing,
			...(patch.title !== undefined ? { title: patch.title } : {}),
			...(patch.completed !== undefined ? { completed: patch.completed } : {}),
		}
		this.store.set(id, updated)
		return updated
	}

	delete(id: string): boolean {
		return this.store.delete(id)
	}

	count(): number {
		return this.store.size
	}
}

export const todoRepo = new InMemoryTodoRepository()
