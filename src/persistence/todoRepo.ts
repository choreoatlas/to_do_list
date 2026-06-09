// EL-persistence: storage / data access (in-memory for now; serves FL1–FL5)
import type { Todo } from "../model/todo"

export interface TodoRepository {
	create(todo: Todo): Todo
	list(): Todo[]
	// future paths: getById() / update() / delete()
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

	count(): number {
		return this.store.size
	}
}

export const todoRepo = new InMemoryTodoRepository()
