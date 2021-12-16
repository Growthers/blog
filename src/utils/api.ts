import glob from "glob";
import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import gitlog from "gitlog";

const dataPath = "data";
const articlesPath = "articles";
const postsDirectory = join(process.cwd(), dataPath, articlesPath);

const gitoptions = (filepath: string) => ({
  repo: join(process.cwd(), dataPath),
  file: filepath,
  fields: ["authorDate"] as const,
});

export type ArticleInfo = {
  title: string;
  slug: string;
  content: string;
  author: string;
  authorName: string;
  icon: string;
  bio: string;
  date: string;
  lastupdate: string;
  site: string;
  github: string;
  twitter: string;
  roles: string[];
};

export const getPost = (author?: string, slug?: string) => {
  if (author === undefined || slug === undefined) return {} as ArticleInfo;

  const fullPath = join(postsDirectory, author, slug, "index.md");
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  const profile = JSON.parse(fs.readFileSync(join(postsDirectory, author, "profile.json"), "utf-8"));

  const commits = gitlog(gitoptions(join(articlesPath, author, slug)));
  const title = data.title ? data.title : "";
  const authorName = profile.name ? profile.name : author;
  const icon = profile.icon ? profile.icon : "";
  const bio = profile.bio ? profile.bio : "";
  const date = data.date ? new Date(data.date).toISOString() : "";
  const lastupdate = commits.length !== 0 ? new Date(commits[0].authorDate).toISOString() : "";

  const site = profile.site ? profile.site : "";
  const github = profile.github ? profile.github : "";
  const twitter = profile.twitter ? profile.twitter : "";
  const roles = profile.roles ? profile.roles : [];

  const info: ArticleInfo = {
    title,
    slug,
    content,
    authorName,
    author,
    icon,
    bio,
    date,
    lastupdate,
    site,
    github,
    twitter,
    roles,
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
