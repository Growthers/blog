import { CodeComponent } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CodeBlock: CodeComponent = ({ inline, className, children }) => {
  if (inline) {
    return <code className={className}>{children}</code>;
  }
  const match = /language-(\w+)(:.+)?/.exec(className || "");
  const lang = match && match[1] ? match[1] : "";
  const name = match && match[2] ? match[2].slice(1) : "";
  if (name === "") {
    return (
      <SyntaxHighlighter
        style={darcula}
        language={lang}
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, "")}
      />
    );
  }

  return (
    <>
      <div>{name}</div>
      <SyntaxHighlighter
        style={darcula}
        language={lang}
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, "")}
      />
    </>
  );
};

export default CodeBlock;
