import { NextPage } from "next";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";
import rehypeRaw from "rehype-raw";

import Layout from "components/Layout";

const index: NextPage = () => (
  <Layout PageTitle="プライバシーポリシー|共同開発鯖 - Blog">
    <div>プライバシーポリシー</div>
    <ReactMarkdown remarkPlugins={[remarkGFM]} rehypePlugins={[rehypeRaw]} className="markdown-body">
      **このサイトでは、Google ******** を利用しています。**
    </ReactMarkdown>
  </Layout>
);

export default index;
