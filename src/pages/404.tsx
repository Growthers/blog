import { NextPage } from "next";

import Layout from "components/Layout";

const NotFound: NextPage = () => (
  <Layout PageTitle="404 Not Found">
    <div className="flex justify-center items-center h-screen pb-[30%]">
      <p className="text-3xl">404 Page Not Found</p>
    </div>
  </Layout>
);

export default NotFound;
