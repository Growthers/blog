import Document, { Html, Head, Main, NextScript } from "next/document";

import { GOOGLE_ANALYTICS_ID } from "lib/gtag";

export const config = { amp: true };
const GOOGLE_ADSENSE_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID ?? "";

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
          <script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js" />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("js", new Date());
              gtag("config", "${GOOGLE_ANALYTICS_ID}", {
                page_path: window.location.pathname,
              });`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <amp-auto-ads type="adsense" data-ad-client={GOOGLE_ADSENSE_ID} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
