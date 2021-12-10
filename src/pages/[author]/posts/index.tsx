import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "node:querystring";

import { getPosts } from "utils/api";

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

export const getStaticProps: GetStaticProps = () => ({
  props: {},
});

const Posts: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { author } = router.query;

    if (typeof author === "string") {
      router.push(`/${author}/`).catch(() => {});
    }
  }, [router]);

  return <>Redirect...</>;
};

export default Posts;
