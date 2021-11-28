import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { ParsedUrlQuery } from "node:querystring";

import { getPosts, getPost, ArticleInfo } from "utils/api";
import Layout from "../../../../components/Layout";

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

export const getStaticProps: GetStaticProps<BeforeProps, Params> = ({ params }) => ({
  props: getPost(params?.author, params?.slug),
});

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

const index: NextPage<AfterProps> = (props) => (
  <Layout PageTitle={props.title}>
    <div>タイトル：{props.title}</div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={props.icon} alt={props.author} />
    <div>作者: {props.author}</div>
    <div>Bio: {props.bio}</div>
    <div>作成: {new Date(props.date).toString()}</div>
    <div>最終更新: {new Date(props.lastupdate).toString()}</div>
    <div>サイト: {props.site}</div>
    <div>GitHub: {props.github}</div>
    <div>Twitter: {props.twitter}</div>
    <div>Roles: {props.roles.toString()}</div>
    <ReactMarkdown
      remarkPlugins={[remarkGFM]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: linkBlock,
      }}
      className="markdown-body"
    >
      {props.content}
    </ReactMarkdown>
  </Layout>
);

export default index;
