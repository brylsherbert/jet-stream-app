declare module '@dailymotion/vast-client' {
  export class VASTClient {
    constructor(options?: any);
    fetch(url: string): Promise<any>;
  }
}
