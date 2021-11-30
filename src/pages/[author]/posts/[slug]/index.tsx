import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";
import rehypeRaw from "rehype-raw";
import * as ogp from "ogp-parser";

import { ParsedUrlQuery } from "node:querystring";

import { getPosts, getPost, ArticleInfo } from "utils/api";
import Layout from "components/Layout";
import Author from "components/Author";

type BeforeProps = ArticleInfo;

type AfterProps = InferGetStaticPropsType<typeof getStaticProps>;

type Params = ParsedUrlQuery & {
  author: string;
  slug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = getPosts();

  return {
    paths: posts.map((post) => ({
      params: {
        author: post.author,
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

const GetOgp = async (url: string) => ogp.default(url);

const DisplayOgp = (url: string, title: string, description: string, isImage: boolean, image: string) => {
  if (title === "") return "";

  const domains = url.match(/([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/g);
  let domain: string;

  if (domains === null) domain = "";
  else if (domains.length === 0) domain = "";
  else domain = domains[0].toString();

  description.replace(/\r?\n/g, "");

  if (isImage)
    return `
  <a href="${url}">
    <div class="w-full my-3 flex border-solid border-2">
      <div class="w-5/6 p-2">
        <p class="w-full text-lg font-medium text-black truncate">${title}</p>
        <p class="w-full font-light text-black truncate">${description}</p>
        <p class="w-full text-sm font-light text-black truncate">${domain}</p>
      </div>
      <img class="h-full w-1/6 my-auto" style="display: ${isImage}" src="${image}" alt=""/>
    </div>
  </a>`;

  return `
  <a href="${url}">
    <div class="w-full p-2 my-3 border-solid border-2">
      <p class="w-full text-lg font-medium text-black truncate">${title}</p>
      <p class="w-full font-light text-black truncate">${description}</p>
      <p class="w-full text-sm font-light text-black truncate">${domain}</p>
    </div>
  </a>`;
};

export const getStaticProps: GetStaticProps<BeforeProps, Params> = async ({ params }) => {
  const data = getPost(params?.author, params?.slug);

  const httpURL = /(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]/gim;

  const Links = data.content.match(httpURL);
  let OGPs: ogp.OgpParserResult[];
  const contents = data.content.split(/\r?\n/);

  if (Links !== null) {
    OGPs = await Promise.all(
      Links.map(async (item) => {
        const url = item.match(httpURL);

        if (url !== null) {
          return GetOgp(url[0]);
        }

        throw new Error();
      }),
    );

    contents.forEach((content, index) => {
      const contentLinks = content.match(httpURL);
      if (contentLinks === null) return;

      contentLinks.forEach((val) => {
        const ogpIndex = Links.indexOf(val);
        if (ogpIndex === -1) return;

        const ogpData = OGPs[ogpIndex];
        const { title } = ogpData;
        const description = "og:description" in ogpData.ogp ? ogpData.ogp["og:description"][0] : "";
        const image = "og:image" in ogpData.ogp ? ogpData.ogp["og:image"][0] : "";
        const isImage = image !== "";
        contents[index] = `${content}\n${DisplayOgp(val, title, description, isImage, image)}\n`;
      });
    });
  }

  data.content = contents.join("\n");

  return {
    props: data,
  };
};

const linkBlock = (
  props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
): JSX.Element => {
  const { href, children } = props;

  if (href === undefined) {
    return <a href={href}>{children}</a>;
  }

  if (href.match("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <a href={href}>{children}</a>;
};

const index: NextPage<AfterProps> = (props) => {
  const isIconURL = props.icon !== "";
  return (
    <Layout PageTitle={props.title}>
      <div className="m-6">
        <p className="flex justify-center p-4 text-3xl font-bold">{props.title}</p>
        <div className="flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {isIconURL && <img className="w-6 h-6 rounded-full mr-2" src={props.icon} alt={props.authorName} />}
          <p className="text-lg">{props.authorName}</p>
        </div>
      </div>
      <div className="bg-white m-auto mb-10 p-8 rounded-3xl w-3/4">
        <ReactMarkdown
          remarkPlugins={[remarkGFM]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: linkBlock,
          }}
          className="markdown-body pb-8"
        >
          {props.content}
        </ReactMarkdown>
        <div className="mt-8 p-6 border-dotted border-2">
          <Author
            AuthorName={props.authorName}
            IconURL={props.icon}
            Bio={props.bio}
            SiteURL={props.site}
            GitHubID={props.github}
            TwitterID={props.twitter}
            Roles={props.roles}
          />
        </div>
      </div>
    </Layout>
  );
};

export default index;
