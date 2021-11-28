import "tailwindcss/tailwind.css";
import "styles/global.scss";
import "github-markdown-css/github-markdown-light.css";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps, router }: AppProps): JSX.Element => (
  <>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} key={router.asPath} />
  </>
);

export default MyApp;
