import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { getPosts } from "utils/api";
import { AuthorPath } from "../../../types/paths";

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
