import glob from "glob";
import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "articles");

type ArticleInfo = {
  title: string;
  author: string;
  slug: string;
  content: string;
};

const getPostMeta = (fileContents: string) => {
  const { data } = matter(fileContents);
  return data.title;
};

export const getPost = (author?: string, slug?: string) => {
  if (author === undefined || slug === undefined) return {} as ArticleInfo;

  const fullPath = join(postsDirectory, author, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const info: ArticleInfo = {
    title: getPostMeta(fileContents),
    author,
    slug,
    content: fileContents,
  };

  return info;
};

export const getPosts = () => {
  const slugs = glob.sync(`*/*/`, { cwd: postsDirectory });
  const posts: ArticleInfo[] = [];
  slugs.forEach((post) => {
    const [author, slug] = post.split("/");
    posts.push(getPost(author, slug));
  });
  return posts;
};
