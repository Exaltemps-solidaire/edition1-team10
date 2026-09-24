export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function apiFetch<T>(chemin: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/v1${chemin}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const code = body?.error?.code ?? "internal";
    const message = body?.error?.message ?? "Une erreur est survenue";
    throw new ApiError(code, message);
  }
  return body as T;
}
