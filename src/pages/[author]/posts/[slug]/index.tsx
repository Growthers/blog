import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import axios from "axios";
import cheerio from "cheerio";

import { getPosts, getPost } from "utils/api";
import { DisplayDate, HasPassed } from "components/Date";
import Layout from "components/Layout";
import AuthorProfile from "components/AuthorProfile";
import CustomReactMarkdown from "components/CustomdReactMarkdown";
import { ArticleInfo } from "types/markdownMeta";
import { SlugPath } from "types/paths";

type OgpData = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
};

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

const GetOgp = async (url: string) => {
  const res = await axios.get(encodeURI(url));
  const html = res.data;
  const $ = cheerio.load(html);

  const title = $("title").text();
  const description = $('meta[property="og:description"]').attr("content");
  const image = $('meta[property="og:image"]').attr("content");

  const info: OgpData = {
    url,
    title: null,
    description: null,
    image: null,
  };

  info.title = title === undefined ? null : title;
  info.description = description === undefined ? null : description;
  info.image = image === undefined ? null : image;

  return info;
};

const DisplayOgp = (url: string, title: string, description: string, isImage: boolean, image: string) => {
  if (title === "") return "";

  const domains = url.match(/([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/g);
  let domain: string;

  if (domains === null) domain = "";
  else if (domains.length === 0) domain = "";
  else domain = domains[0].toString();

  description.replace(/\r?\n/g, "");

  if (isImage)
    return `
  <a href="${url}">
    <div class="w-full my-2 flex border-solid border-2">
      <div class="w-4/6 sm:w-5/6 p-2">
        <p class="w-full sm:text-lg font-medium text-black truncate" style="margin: unset">${title}</p>
        <p class="w-full font-light text-black truncate" style="margin: unset">${description}</p>
        <p class="w-full text-sm font-light text-black truncate" style="margin: unset">${domain}</p>
      </div>
      <img class="h-full w-2/6 sm:w-1/6 my-auto" style="display: ${isImage}" src="${image}" alt=""/>
    </div>
  </a>`;

  return `
  <a href="${url}">
    <div class="w-full p-2 my-2 border-solid border-2">
      <p class="w-full sm:text-lg font-medium text-black truncate" style="margin: unset">${title}</p>
      <p class="w-full font-light text-black truncate" style="margin: unset">${description}</p>
      <p class="w-full text-sm font-light text-black truncate" style="margin: unset">${domain}</p>
    </div>
  </a>`;
};

export const getStaticProps: GetStaticProps<ArticleInfo, SlugPath> = async ({ params }) => {
  const data = getPost(params?.author, params?.slug);

  const httpURL = /https?:\/\/[\w!?/+\-_~;.,*&@#$%=']+/gim;

  const GetLinks = data.content.match(httpURL);
  const Links = Array.from(new Set(GetLinks));
  let OGPs: OgpData[];
  const contents = data.content.split(/\r?\n/);

  if (Links.length !== 0) {
    OGPs = await Promise.all(
      Links.map(async (item) => {
        const url = item.match(httpURL);

        if (url !== null) {
          return GetOgp(url[0]);
        }

        throw new Error();
      }),
    );

    contents.forEach((content, index) => {
      const GetcontentLinks = content.match(httpURL);
      const contentLinks = Array.from(new Set(GetcontentLinks));
      if (contentLinks.length === 0) return;

      contentLinks.forEach((val) => {
        const ogpIndex = Links.indexOf(val);
        if (ogpIndex === -1) return;

        const urlParams = new URLSearchParams(val.split("?")[1]);
        const isOgp = urlParams.has("isogp");

        // isogpがあればOGPを非表示にする
        if (isOgp) {
          // urlの変更
          const replaceVal = val.replace(`isogp=${urlParams.get("isogp")}`, " ");
          contents[index] = contents[index].replace(val, replaceVal);
          return;
        }

        const ogp = OGPs[ogpIndex];
        const title = ogp.title === null ? "" : ogp.title;
        const description = ogp.description === null ? "" : ogp.description;
        const image = ogp.image === null ? "" : ogp.image;
        const isImage = image !== "";
        contents[index] = `${contents[index]}\n${DisplayOgp(val, title, description, isImage, image)}\n`;
      });
    });
  }

  data.content = contents.join("\n");

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
