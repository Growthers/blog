import React, { FC } from "react";
import remarkGFM from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import Script from "next/script";

type Props = {
  children: string;
};

const linkBlock = (
  props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
): JSX.Element => {
  if (props.href === undefined) {
    return <a href={props.href}>{props.children}</a>;
  }

  if (props.href.match("http")) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  }

  return <a href={props.href}>{props.children}</a>;
};

const CustomReactMarkdown: FC<Props> = (props) => (
  <>
    <ReactMarkdown
      remarkPlugins={[remarkGFM]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: linkBlock,
      }}
      className="markdown-body pb-8"
    >
      {props.children}
    </ReactMarkdown>
    <Script src="https://platform.twitter.com/widgets.js" />
  </>
);

export default CustomReactMarkdown;
