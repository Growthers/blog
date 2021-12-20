import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";

import { GetOgp, DisplayOgp, isNull } from "utils/ogp";
import { getPosts, getPost } from "utils/api";
import { DisplayDate, HasPassed } from "components/Date";
import Layout from "components/Layout";
import AuthorProfile from "components/AuthorProfile";
import CustomReactMarkdown from "components/CustomdReactMarkdown";
import { ArticleInfo } from "types/markdownMeta";
import { SlugPath } from "types/paths";
import { OgpData } from "types/ogpData";

export const getStaticPaths: GetStaticPaths<SlugPath> = async () => {
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

export const getStaticProps: GetStaticProps<ArticleInfo, SlugPath> = async ({ params }) => {
  const data: ArticleInfo = getPost(params?.author, params?.slug);

  const httpURL = /https?:\/\/[\w!?/+\-_~;.,*&@#$%=']+/gim;

  /* リンクを全取得 -> ogpDataに保存 */
  const links = Array.from(new Set(data.content.match(httpURL)));

  const ogpData: OgpData[] = await Promise.all(links.map(async (item) => GetOgp(item)));

  /* 一行ごとに区切る */
  data.content = data.content.split(/\r?\n/).reduce((prev, line) => {
    Array.from(new Set(line.match(httpURL))).forEach((url) => {
      const ogpIndex = links.indexOf(url);
      if (ogpIndex === -1) return;

      const urlParams = new URLSearchParams(url.split("?")[1]);
      if (urlParams.has("isogp")) {
        /* isogpがある場合, lineからsogpを削除する */
        line.replace(url, url.replace(`isogp=${urlParams.get("isogp")}`, " "));
      } else {
        /* isogpが無い場合, lineにogpを追加 */
        const ogp = ogpData[ogpIndex];
        line = `${line}\n${DisplayOgp(
          url,
          isNull(ogp.title),
          isNull(ogp.description),
          ogp.image !== "",
          isNull(ogp.image),
        )}\n`;
      }
    });

    /* prev(前回までのline)と今回のlineを結合 */
    return `${prev}\n${line}`;
  });

  return {
    props: data,
  };
};

const index: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const isIconURL = props.icon !== "";

  return (
    <Layout
      PageTitle={props.title}
      PageImage={`https://og-image.growthers.dev/${props.title}.png?blog_author=${props.authorName}&background=blog`}
    >
      <div className="m-6">
        <p className="flex justify-center p-4 text-xl lg:text-3xl font-bold break-all">{props.title}</p>
        <div className="flex justify-center items-center">
          {isIconURL && <img className="w-6 h-6 rounded-full mr-2" src={props.icon} alt={props.authorName} />}
          <p className="text-lg">{props.authorName}</p>
        </div>
        <div className="flex flex-col mt-3">
          <DisplayDate create={props.date} update={props.lastupdate} />
        </div>
      </div>

      <div className="m-auto pb-10 h-full sm:w-11/12 md:w-5/6 lg:w-7/12">
        <HasPassed create={props.date} update={props.lastupdate} />
        <div className="bg-white p-4 sm:p-6 md:p-8 pt-6 sm:rounded-lg md:rounded-xl lg:rounded-2xl">
          <CustomReactMarkdown>{props.content}</CustomReactMarkdown>

          <AuthorProfile
            className="mt-8 p-2 sm:p-6 border-dotted border-2"
            Author={props.author}
            AuthorName={props.authorName}
            IconURL={props.icon}
            Bio={props.bio}
            SiteURL={props.site}
            GitHubID={props.github}
            TwitterID={props.twitter}
            Roles={props.roles}
          />
        </div>
      </div>
    </Layout>
  );
};

export default index;
