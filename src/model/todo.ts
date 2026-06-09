// EL-model: Todo entity + factory (shared by FL1–FL5)

export interface Todo {
	id: string
	title: string
	completed: boolean
	createdAt: string
}

export interface CreateTodoInput {
	title: string
	completed?: boolean
}

let counter = 0
function nextId(): string {
	counter += 1
	return `${Date.now().toString(36)}-${counter}`
}

export function makeTodo(input: CreateTodoInput): Todo {
	return {
		id: nextId(),
		title: input.title,
		completed: input.completed ?? false,
		createdAt: new Date().toISOString(),
	}
}
