import { NextPage } from "next";

import Layout from "components/Layout";

const NotFound: NextPage = () => (
  <Layout PageTitle="404 Not Found">
    <div className="mt-40 text-3xl flex justify-center items-center">404 Page Not Found</div>
  </Layout>
);

export default NotFound;
