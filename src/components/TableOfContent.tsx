import ReactDOMServer from "react-dom/server";
import { FC } from "react";
import ReactMarkdown from "react-markdown";
import { HeadingProps } from "react-markdown/lib/ast-to-react";

type Doms = {
  title: string | undefined;
  position: string | undefined;
  duplicate: number | undefined;
  child: {
    title: string | undefined;
    position: string | undefined;
    duplicate: number | undefined;
    child: {
      title: string | undefined;
      position: string | undefined;
      duplicate: number | undefined;
    }[];
  }[];
}[];

type TOCProps = {
  domArray: Doms | null;
};

export const SetPosirtion: FC<HeadingProps> = ({ level, children, node }) => {
  const ifPosition = node.position?.start.line.toString();
  const position = ifPosition !== undefined ? ifPosition : "000";
  if (level === 1) return <h1 data-position={position}>{children}</h1>;
  if (level === 2) return <h2 data-position={position}>{children}</h2>;
  return <h3 data-position={position}>{children}</h3>;
};

export const TableOfContents: FC<TOCProps> = ({ domArray }) => {
  const cssDegin = "bg-white p-4 max-h-full overflow-auto sticky top-1/4 sm:rounded-lg md:rounded-xl lg:rounded-2xl";
  if (domArray === null) return <div className={cssDegin}>見出しがありません</div>;

  return (
    <div className={cssDegin}>
      {domArray.map((h1) => (
        <div
          key={h1.title ? `${h1.title}${h1.duplicate === 0 ? "" : `-${h1.duplicate?.toString()}`}` : null}
          className="ml-3 py-1"
        >
          {h1.title ? (
            <a href={`#${h1.title}${h1.duplicate === 0 ? "" : `-${h1.duplicate?.toString()}`}`}>{h1.title}</a>
          ) : (
            ""
          )}
          {h1.child.map((h2) => (
            <div
              key={h2.title ? `${h2.title}${h2.duplicate === 0 ? "" : `-${h2.duplicate?.toString()}`}` : null}
              className="ml-3 py-1"
            >
              {h2.title ? (
                <a href={`#${h2.title}${h2.duplicate === 0 ? "" : `-${h2.duplicate?.toString()}`}`}>{h2.title}</a>
              ) : (
                ""
              )}
              {h2.child.map((h3) => (
                <div
                  key={h3.title ? `${h3.title}${h3.duplicate === 0 ? "" : `-${h3.duplicate?.toString()}`}` : null}
                  className="ml-3 py-1"
                >
                  {h3.title ? (
                    <a href={`#${h3.title}${h3.duplicate === 0 ? "" : `-${h3.duplicate?.toString()}`}`}>{h3.title}</a>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CreateDomArray = (props: string): Doms | null => {
  const domTrees: Doms = [];

  const OutsideConditions = /(<h1[^>]*>.*?<\/h1>)|(<h2[^>]*>.*?<\/h2>)|(<h3[^>]*>.*?<\/h3>)/gimu;
  const InsideConditions = /<[^>]*>/gimu;
  const PositionConditions = /(?<=<h[1-3] data-position=")\d+/gimu;
  const StringRendedData = ReactDOMServer.renderToString(
    <ReactMarkdown
      components={{
        h1: (DomProps) => SetPosirtion(DomProps),
        h3: (DomProps) => SetPosirtion(DomProps),
        h2: (DomProps) => SetPosirtion(DomProps),
      }}
    >
      {props}
    </ReactMarkdown>,
  );
  const outsideData = StringRendedData.match(OutsideConditions) as Array<string>;

  if (outsideData === undefined || outsideData === [] || outsideData === null) return null;

  outsideData.forEach((data) => {
    const txt = data.replace(InsideConditions, "");
    const resultPosition = data.match(PositionConditions) as Array<string>;

    let count = 0;
    domTrees.forEach((h1) => {
      if (h1.title === txt) count += 1;
      if (h1.child) {
        h1.child.forEach((h2) => {
          if (h2.title === txt) count += 1;
          if (h2.child) {
            h2.child.forEach((h3) => {
              if (h3.title === txt) count += 1;
            });
          }
        });
      }
    });

    if (data.search(/<h1 [^>]*>.*?<\/h1>/gimu) !== -1) {
      domTrees.push({
        title: txt,
        position: resultPosition[0],
        duplicate: count,
        child: [],
      });
    } else if (data.search(/<h2 [^>]*>.*?<\/h2>/gimu) !== -1) {
      if (domTrees.length === 0) {
        domTrees.push({
          title: undefined,
          position: undefined,
          duplicate: undefined,
          child: [],
        });
      }
      domTrees.slice(-1)[0].child.push({
        title: txt,
        position: resultPosition[0],
        duplicate: count,
        child: [],
      });
    } else if (data.search(/<h3 [^>]*>.*?<\/h3>/gimu) !== -1) {
      if (domTrees.length === 0) {
        domTrees.push({
          title: undefined,
          position: undefined,
          duplicate: undefined,
          child: [],
        });
      }
      if (domTrees.slice(-1)[0].child.length === 0) {
        domTrees.slice(-1)[0].child.push({
          title: undefined,
          position: undefined,
          duplicate: undefined,
          child: [],
        });
      }

      domTrees.slice(-1)[0].child.slice(-1)[0].child.push({
        title: txt,
        duplicate: count,
        position: resultPosition[0],
      });
    }
  });

  return domTrees;
};

export const SetId: FC<HeadingProps> = ({ children, node, level }, domArray: Doms) => {
  const ifPosition = node.position?.start.line.toString();
  const position = ifPosition !== undefined ? ifPosition : "000";

  if (level === 1) {
    const target = domArray.find((h1) => h1.position === position);
    return (
      <h1 id={`${target?.title}${target?.duplicate === 0 ? "" : `-${target?.duplicate?.toString()}`}`}>{children}</h1>
    );
  }
  if (level === 2) {
    const target = domArray
      .find((h1) => h1.child.find((h2) => h2.position === position) !== undefined)
      ?.child.find((h2) => h2.position === position);

    return (
      <h2 id={`${target?.title}${target?.duplicate === 0 ? "" : `-${target?.duplicate?.toString()}`}`}>{children}</h2>
    );
  }

  const target = domArray
    .find((h1) => h1.child.find((h2) => h2.child.find((h3) => h3.position === position) !== undefined) !== undefined)
    ?.child.find((h2) => h2.child.find((h3) => h3.position === position) !== undefined)
    ?.child.find((h3) => h3.position === position);

  return (
    <h3 id={`${target?.title}${target?.duplicate === 0 ? "" : `-${target?.duplicate?.toString()}`}`}>{children}</h3>
  );
};
