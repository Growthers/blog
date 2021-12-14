import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "node:querystring";
import moment from "moment";
import "moment/locale/ja";

import { MdUpdate } from "react-icons/md";

import { ArticleInfo, getPosts } from "utils/api";
import Layout from "components/Layout";
import Author from "components/Author";

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
    .filter((element) => element.author === params?.author && new Date(element.date).getDate())
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
    <div className="flex justify-center my-10 p-4 text-3xl font-bold overflow-hidden">{props.author}の記事</div>
    <div className="m-auto w-11/12">
      <div className="w-full my-8 flex justify-center sm:justify-around flex-wrap">
        {props.posts.map((post) => (
          <div className="bg-white m-2 py-4 px-6 rounded-lg overflow-hidden w-full sm:w-5/12 lg:w-1/5" key={post.title}>
            <Link href={`/${post.author}/posts/${post.slug}`}>
              <a className="w-full py-3 text-xl font-extrabold text-black" title={post.title}>
                <p className="truncate">{post.title}</p>
                <div className="flex items-center mt-1">
                  <MdUpdate />
                  <p className="ml-1 text-sm font-light">{moment(new Date(post.date)).fromNow()}</p>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className="bg-white mx-auto my-4 p-2 sm:p-6 rounded-xl sm:w-11/12 md:w-5/6 lg:w-7/12">
        <Author
          AuthorName={props.posts[0].authorName}
          IconURL={props.posts[0].icon}
          Bio={props.posts[0].bio}
          SiteURL={props.posts[0].site}
          GitHubID={props.posts[0].github}
          TwitterID={props.posts[0].twitter}
          Roles={props.posts[0].roles}
        />
      </div>
    </div>
  </Layout>
);

export default index;
