export class NoStreamError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "NoStreamError";
  }
}
