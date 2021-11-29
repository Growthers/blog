import type { FC, ReactNode } from "react";
import Head from "next/head";

import Header from "./Header";
import Footer from "./Footer";

const DefaultDescription = "Blog - 共同開発鯖";
const DefaultImage = "https://og-image.growthers.dev/共同開発鯖%20-%20blog.png?&background=blog";

interface Information {
  PageTitle: string;
  PageDescription: string;
  PageImage: string;
}

type Props = {
  PageTitle: string;
  PageDescription?: string;
  PageImage?: string;
  children: ReactNode;
};

const Metas: FC = () => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <meta name="theme-color" content="#ffffff" />
  </>
);

const SeoMetas: FC<Information> = ({ PageTitle, PageDescription, PageImage }) => (
  <>
    <meta name="name" content={PageTitle} />
    <meta name="image" content={PageImage} />
    <meta name="description" content={PageDescription} />
  </>
);

const OgpMetas: FC<Information> = ({ PageTitle, PageDescription, PageImage }) => (
  <>
    <meta property="og:title" content={PageTitle} />
    <meta property="og:description" content={PageDescription} />
    <meta property="og:image" content={PageImage} />
    <meta property="og:image:alt" content="Blog - 共同開発鯖" />
    <meta property="og:site_name" content="Blog - 共同開発鯖" />
  </>
);

const TwitterMetas: FC<Information> = ({ PageTitle, PageDescription, PageImage }) => (
  <>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@udcgrowthers" />
    <meta name="twitter:title" content={PageTitle} />
    <meta name="twitter:description" content={PageDescription} />
    <meta name="twitter:image" content={PageImage} />
  </>
);

const Layout: FC<Props> = ({ PageTitle, children, PageDescription = DefaultDescription, PageImage = DefaultImage }) => (
  <>
    <Head>
      <title>{PageTitle}</title>
      <Metas />
      <SeoMetas PageTitle={PageTitle} PageDescription={PageDescription} PageImage={PageImage} />
      <OgpMetas PageTitle={PageTitle} PageDescription={PageDescription} PageImage={PageImage} />
      <TwitterMetas PageTitle={PageTitle} PageDescription={PageDescription} PageImage={PageImage} />
    </Head>
    <main className="w-full">
      <div className="min-h-screen w-full">
        <Header />
        {children}
      </div>
      <Footer />
    </main>
  </>
);

Layout.defaultProps = {
  PageDescription: DefaultDescription,
  PageImage: DefaultImage,
};

export default Layout;
