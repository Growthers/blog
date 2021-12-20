import { InferGetStaticPropsType, NextPage } from "next";
import "moment/locale/ja";

import { getPosts } from "utils/api";
import Layout from "components/Layout";
import PostCard from "../components/PostCard";

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
    .filter((element) => new Date(element.date).getDate())
    .slice(0, 21);

  return {
    props: {
      posts,
    },
  };
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ posts }) => (
  <Layout PageTitle="共同開発鯖 - Blog">
    <div className="flex justify-center my-10 p-4 text-3xl font-bold">記事一覧</div>
    <div className="m-auto flex justify-center items-center sm:justify-around flex-wrap w-11/12">
      {posts.map((post) => (
        <PostCard post={post} showAuthor key={post.slug} />
      ))}
    </div>
  </Layout>
);

export default Home;
