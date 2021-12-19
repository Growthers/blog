interface WindowGtag {
  gtag(
    type: "config",
    googleAnalyticsId: string,
    options: {
      page_path: string;
    },
  ): void;

  gtag(
    type: "event",
    eventAction: string,
    fieldObject: {
      event_label: string;
      event_category: string;
      value?: string;
    },
  ): void;
}

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "";

export const pageview = (url: string): void => {
  (window as unknown as WindowGtag).gtag("config", GOOGLE_ANALYTICS_ID, {
    page_path: url,
  });
};

type Event = {
  action: string;
  category: string;
  label: string;
  value?: string;
};

export const event = ({ action, category, label, value }: Event): void => {
  (window as unknown as WindowGtag).gtag("event", action, {
    event_category: category,
    event_label: JSON.stringify(label),
    value,
  });
};
