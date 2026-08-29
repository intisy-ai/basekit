/** An error body as the front door encodes one, which is what most of these assertions read. */
export interface WireError {
  /** The error, in the app's own wire shape. */
  error: {
    /** The vendor's error type string. */
    type: string;
    /** What it says, where the assertion cares. */
    message?: string;
  };
}

/**
 * Reads a response body, stating the shape the assertion expects of it.
 *
 * @remarks
 * A wire body's shape belongs to the vendor, not to this repo, so a test names the part it reads
 * rather than the whole envelope.
 *
 * @param response the response to read
 * @returns its parsed body, as the named shape
 */
export async function wireBody<T = WireError>(response: Response): Promise<T> {
  return (await response.json()) as T;
}
