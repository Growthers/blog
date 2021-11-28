import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { ParsedUrlQuery } from "node:querystring";

import { getPosts } from "utils/api";
import Layout from "../../components/Layout";

type BeforeProps = {
  author?: string;
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

export const getStaticProps: GetStaticProps<BeforeProps, Params> = async ({ params }) => ({
  props: {
    author: params?.author,
  },
});

const index: NextPage<AfterProps> = (props) => (
  <Layout PageTitle={`${props.author} - Blog`}>
    <h2>{props.author}のページ</h2>
  </Layout>
);

export default index;
