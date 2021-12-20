import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import { getPosts } from "utils/api";
import Layout from "components/Layout";
import AuthorProfile from "components/AuthorProfile";
import { ArticleInfo } from "types/markdownMeta";
import { AuthorPath } from "types/paths";
import PostCard from "../../components/PostCard";

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
          <PostCard post={post} showAuthor={false} key={post.slug} />
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
