import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";
import { ParsedUrlQuery } from "node:querystring";
import { getPosts, getPost } from "../../../../../utils/api";

type BeforeProps = {
  title: string;
  author: string;
  slug: string;
  content: string;
};

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

const linkBlock = (href): string => {
  if (href.match('http')) {
    return "_blank"
  }
  return ""
};

const index: NextPage<AfterProps> = (props) => (
  <div>
    <h2>{props.title}</h2>
    <div>Author: {props.author}</div>
    <ReactMarkdown
      remarkPlugins={[remarkGFM]}
      linkTarget={linkBlock}>
      {props.content}
    </ReactMarkdown>
  </div>
);

export default index;
