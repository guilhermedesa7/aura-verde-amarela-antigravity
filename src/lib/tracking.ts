// Tracking events for Meta, TikTok, Google Ads
// Replace with actual pixel/tag implementations

export type TrackingEvent =
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'ClickButton';

interface TrackingData {
  content_id?: string;
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  [key: string]: unknown;
}

export function trackEvent(event: TrackingEvent, data?: TrackingData) {
  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event, data);
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track(event, data);
  }

  // Google Ads / gtag
  if (typeof window !== 'undefined' && (window as any).gtag) {
    const gtagEvent = event === 'ViewContent' ? 'view_item'
      : event === 'AddToCart' ? 'add_to_cart'
      : event === 'InitiateCheckout' ? 'begin_checkout'
      : event === 'Purchase' ? 'purchase'
      : event;
    (window as any).gtag('event', gtagEvent, data);
  }

  console.log(`[Track] ${event}`, data);
}
