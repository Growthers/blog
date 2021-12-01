import { InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import moment from "moment";
import "moment/locale/ja";

import { FaUserCircle } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";

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
    <div className="flex justify-center my-10 p-4 text-3xl font-bold">記事一覧</div>
    <div className="m-auto flex justify-center sm:justify-around flex-wrap w-11/12">
      {posts.map((post) => (
        <div className="bg-white m-2 py-4 px-6 rounded-lg overflow-hidden w-full sm:w-5/12 lg:w-1/5" key={post.title}>
          <Link href={`/${post.author}/posts/${post.slug}`}>
            <a className="w-full py-3 text-xl font-extrabold text-black truncate" title={post.title}>
              <p className="truncate">{post.title}</p>
            </a>
          </Link>
          <Link href={`/${post.author}`}>
            <a>
              <div className="flex items-center mt-1">
                {post.icon !== "" && <img className="h-8 w-8 rounded-full" src={post.icon} alt={post.authorName} />}
                {post.icon === "" && <FaUserCircle className="h-8 w-8" />}
                <div className="ml-2">
                  <p>{post.authorName}</p>
                  <div className="flex items-center">
                    <MdUpdate />
                    <p className="ml-1 text-sm font-light">{moment(post.date).fromNow()}</p>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  </Layout>
);

export default Home;
