class TokenManager {
  private accessToken: string | null = null;
  private subscribers: ((token: string | null) => void)[] = [];

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
    this.notifySubscribers(token);
  }

  clearAccessToken(): void {
    this.accessToken = null;
    this.notifySubscribers(null);
  }

  subscribe(callback: (token: string | null) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers(token: string | null): void {
    this.subscribers.forEach((callback) => callback(token));
  }
}

export const tokenManager = new TokenManager();
