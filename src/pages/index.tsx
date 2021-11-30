import { InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import { getPosts } from "utils/api";
import Layout from "components/Layout";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = () => {
  const posts = getPosts()
    .sort((a, b) => {
      if (a.date === "") return 1;
      if (b.date === "") return -1;

      const aD = new Date(a.date);
      const bD = new Date(b.date);

      if (aD.getFullYear() === bD.getFullYear()) {
        if (aD.getMonth() === bD.getMonth()) {
          if (aD.getDate() === bD.getDate()) {
            return 0;
          }
          return bD.getDate() - aD.getDate();
        }
        return bD.getMonth() - aD.getMonth();
      }
      return bD.getFullYear() - aD.getFullYear();
    })
    .slice(0, 21);

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
