import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { ParsedUrlQuery } from "node:querystring";

import { ArticleInfo, getPosts } from "utils/api";
import Layout from "components/Layout";
import Link from "next/link";

type BeforeProps = {
  author?: string;
  posts: ArticleInfo[];
};

type AfterProps = InferGetStaticPropsType<typeof getStaticProps>;

type Params = ParsedUrlQuery & {
  author: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = getPosts();

  return {
    paths: posts.map((post) => ({
      params: {
        author: post.author,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BeforeProps, Params> = async ({ params }) => {
  const data = getPosts()
    .filter((element) => element.author === params?.author)
    .slice(0, 11);

  return {
    props: {
      author: params?.author,
      posts: data,
    },
  };
};

const index: NextPage<AfterProps> = (props) => (
  <Layout PageTitle={`${props.author} - Blog`}>
    <h2>{props.author}のページ</h2>
    <ul>
      {props.posts.map((post) => (
        <li key={post.title}>
          <Link href={`/${post.author}/posts/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  </Layout>
);

export default index;
