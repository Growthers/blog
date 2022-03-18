import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "styles/global.scss";
import "github-markdown-css/github-markdown-light.css";

import * as gtag from "lib/gtag";

const MyApp = ({ Component, pageProps, router: routerProp }: AppProps): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string): void => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} key={routerProp.asPath} />
    </>
  );
};

export default MyApp;
