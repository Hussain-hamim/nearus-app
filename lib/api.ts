import { NextResponse } from "next/server";

export function humanError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function requireFields(message = "Something went wrong. Please try again.") {
  return humanError(message);
}

export async function parseJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
