export class NoMatchFoundError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "NoMatchFoundError";
  }
}
