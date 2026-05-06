/**
 * Extracts the API error message from an httpResource error.
 * httpResource types errors as `Error`, but at runtime they are `HttpErrorResponse`.
 * The backend message lives in `.error.message`, not in Angular's `.message`.
 */
export function extractApiError(err: Error | null | undefined): string | undefined {
  if (!err) return undefined;
  const httpErr = err as unknown as { error?: { message?: string } };
  return httpErr.error?.message ?? undefined;
}
