declare module 'ads-manager' {
  export default class AdsManager {
    constructor(options: any);
    fetchAds(): Promise<void>;
    playAd(): void;
    addEventListener(event: string, callback: () => void): void;
  }
}
