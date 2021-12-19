import { ParsedUrlQuery } from "node:querystring";

export type AuthorPath = ParsedUrlQuery & {
  author: string;
};

export type SlugPath = ParsedUrlQuery & {
  author: string;
  slug: string;
};
