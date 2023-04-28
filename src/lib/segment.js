import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load({
  writeKey: import.meta.env.VITE_SEGMENT_KEY,
});

export const AnalyticTrack = (evtName, data) => {
  analytics.track(evtName, data)
}

export const AnalyticIdentify = (userId, data) => {
  analytics.identify(userId, data)
}