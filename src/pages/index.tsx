import { InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import { getPosts } from "utils/api";
import Layout from "components/Layout";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = () => {
  const posts = getPosts();
  return {
    props: {
      posts,
    },
  };
};

const Home: NextPage<Props> = ({ posts }) => (
  <Layout PageTitle="共同開発鯖 - Blog">
    <div>記事一覧</div>
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.title}>
            {post.title}
            <ul>
              <li>
                <Link href={`/${post.author}/posts/${post.slug}`}>{`${post.author}の${post.slug}`}</Link>
              </li>
              <li>
                <Link href={`/${post.author}`}>{`${post.author}のページ`}</Link>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
);

export default Home;
