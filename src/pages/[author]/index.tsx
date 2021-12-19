import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import moment from "moment";
import "moment/locale/ja";

import { MdUpdate } from "react-icons/md";

import { getPosts } from "utils/api";
import Layout from "components/Layout";
import AuthorProfile from "components/AuthorProfile";
import { ArticleInfo } from "types/markdownMeta";
import { AuthorPath } from "types/paths";

export const getStaticPaths: GetStaticPaths<AuthorPath> = async () => {
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

export const getStaticProps: GetStaticProps<{ posts: ArticleInfo[] }, AuthorPath> = async ({ params }) => {
  const posts = getPosts()
    .filter((element) => element.author === params?.author && new Date(element.date).getDate())
    .slice(0, 11);

  return {
    props: {
      posts,
    },
  };
};

const index: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ posts }) => (
  <Layout PageTitle={`${posts[0].authorName} - Blog`}>
    <div className="flex justify-center my-10 p-4 text-3xl font-bold overflow-hidden">{posts[0].authorName}の記事</div>
    <div className="m-auto w-11/12">
      <div className="w-full my-8 flex justify-center items-center sm:justify-around flex-wrap">
        {posts.map((post) => (
          <div
            className="bg-white m-2 py-4 px-6 rounded-lg overflow-hidden h-full w-full sm:w-5/12 lg:w-1/5"
            key={post.title}
          >
            <Link href={`/${post.author}/posts/${post.slug}`}>
              <a className="w-full py-3 text-xl font-extrabold text-black" title={post.title}>
                <p className="break-all">{post.title}</p>
                <div className="flex items-center mt-1">
                  <MdUpdate />
                  <p className="ml-1 text-sm font-light">{moment(new Date(post.date)).fromNow()}</p>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>

      <AuthorProfile
        className="bg-white mx-auto my-4 p-2 sm:p-6 rounded-xl sm:w-11/12 md:w-5/6 lg:w-7/12"
        Author={posts[0].author}
        AuthorName={posts[0].authorName}
        IconURL={posts[0].icon}
        Bio={posts[0].bio}
        SiteURL={posts[0].site}
        GitHubID={posts[0].github}
        TwitterID={posts[0].twitter}
        Roles={posts[0].roles}
      />
    </div>
  </Layout>
);

export default index;
