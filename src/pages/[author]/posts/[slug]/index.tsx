import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";
import rehypeRaw from "rehype-raw";
import * as ogp from "ogp-parser";

import { ParsedUrlQuery } from "node:querystring";

import { getPosts, getPost, ArticleInfo } from "utils/api";
import Layout from "components/Layout";
import Author from "components/Author";

import { FC } from "react";
import { create } from "node:domain";

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

export const getStaticProps: GetStaticProps<BeforeProps, Params> = async ({ params }) => {
  const data = getPost(params?.author, params?.slug);

  const httpURL = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
  const mdURL = /\[.*]\((https?|ftp)(:\/\/[-_.!~*\\'()a-zA-Z0-9;/?:@&=+$,%#]+)\)/gim;

  const mdLinks = data.content.match(mdURL);

  let mdOGPs;
  let result = data.content;

  if (mdLinks !== null) {
    mdOGPs = await Promise.all(
      mdLinks.map(async (item) => {
        const url = item.match(httpURL);

        if (url !== null) {
          return GetOgp(url[0]);
        }

        throw new Error();
      }),
    );

    mdOGPs.forEach((val, index) => {
      const url = mdLinks[index].match(httpURL);
      const { title } = val;
      const description = "og:description" in val.ogp ? val.ogp["og:description"][0] : "";
      const image = "og:image" in val.ogp ? val.ogp["og:image"][0] : "";
      const isImage = image !== "" ? "block" : "none";
      result = result.replace(
        mdLinks[index],
        `<a href="${url}">
          <div class="w-full my-3 flex border-solid border-2">
            <div class="w-5/6 p-2">
              <p class="w-full text-lg font-medium text-black truncate">${title}</p>
              <p class="w-full font-light text-black truncate">${description}</p>
              <p class="w-full text-sm font-light text-black truncate">${url
                ?.toString()
                .match(/([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/g)}</p>
            </div>
            <img class="h-full w-1/6 my-auto" style="display: ${isImage}" src="${image}" alt=""/>
          </div>
        </a>`,
      );
    });
  }

  data.content = result;

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

  const zeroPadding = (targetWord: string, size: number, fillWord = "0"): string => {
    const len: number = targetWord.length;
    const fillw: string = fillWord === undefined ? "0" : fillWord;
    const zero = new Array<string>(size - len).fill(fillw).join("");
    const result = zero + targetWord;
    return result;
  };

  const DayParam: FC = () => {
    /**
     const createDate = new Date("Sun Nov 3 2021 09:00:00 GMT+0900 (日本標準時)");
     const updateDate = new Date("Sun Nov 12 2021 23:37:04 GMT+0900 (日本標準時)");
    */

    const createDate = new Date(props.date);
    const updateDate = new Date(props.lastupdate);

    const createYear = createDate.getFullYear();
    const createMonth = createDate.getMonth();
    const createDay = createDate.getDate();

    const updateYear = updateDate.getFullYear();
    const updateMonth = updateDate.getMonth();
    const updateDay = updateDate.getDate();

    const createTemp = `${zeroPadding(String(createYear), 4)}年${zeroPadding(String(createMonth), 2)}月${zeroPadding(
      String(createDay),
      2,
    )}日に作成`;
    const updateTemp = `${zeroPadding(String(updateYear), 4)}年${zeroPadding(String(updateMonth), 2)}月${zeroPadding(
      String(updateDay),
      2,
    )}日に更新`;

    if (String(createDate) === "" && String(updateDate) === "") return {};
    if (String(createDate) === "") return <div className="flex justify-center">{updateTemp}</div>;
    if (String(updateDate) === "") return <div className="flex justify-center">{createTemp}</div>;
    if (
      +(createDate >= updateDate) ||
      (createYear === updateYear && createMonth === updateMonth && createDay === updateDay)
    )
      return <div className="flex justify-center">{createTemp}</div>;
    return (
      <div className="flex justify-center">
        {createTemp}
        <br />
        {updateTemp}
      </div>
    );
  };

  return (
    <Layout PageTitle={props.title}>
      <div className="m-6">
        <p className="flex justify-center p-4 text-3xl font-bold">{props.title}</p>
        <div className="flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {isIconURL && <img className="w-6 h-6 rounded-full mr-2" src={props.icon} alt={props.authorName} />}
          <p className="text-lg">{props.authorName}</p>
        </div>

        <DayParam />
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
