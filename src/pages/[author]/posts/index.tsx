import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Posts: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { author } = router.query;

    if (typeof author === "string") {
      router.push("/[author]/", `/${author}/`).catch(() => {});
    }
  }, [router]);

  return <>Redirect...</>;
};

export default Posts;
