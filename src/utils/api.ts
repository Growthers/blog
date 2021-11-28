import glob from "glob";
import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import gitlog from "gitlog";

const articlesPath = "articles";
const postsDirectory = join(process.cwd(), articlesPath);

const gitoptions = (filepath: string) => ({
  repo: process.cwd(),
  file: filepath,
  fields: ["authorDate"] as const,
});

type ArticleInfo = {
  title: string;
  author: string;
  slug: string;
  content: string;
  lastupdate: string;
};

export const getPost = (author?: string, slug?: string) => {
  if (author === undefined || slug === undefined) return {} as ArticleInfo;

  const fullPath = join(postsDirectory, author, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  const commits = gitlog(gitoptions(join(articlesPath, author, slug)));
  const lastupdate = commits[0].authorDate;

  const info: ArticleInfo = {
    title: data.title,
    author,
    slug,
    content,
    lastupdate,
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
