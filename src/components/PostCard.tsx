import Link from "next/link";
import { FC } from "react";
import { ArticleInfo } from "types/markdownMeta";
import { MdUpdate } from "react-icons/md";
import moment from "moment";
import "moment/locale/ja";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  post: ArticleInfo;
  showAuthor: boolean;
};

const PostCard: FC<Props> = (props) => (
  <div
    className="bg-white m-2 py-4 px-6 rounded-lg overflow-hidden h-full w-full sm:w-5/12 lg:w-1/5"
    key={props.post.title}
  >
    {props.showAuthor ? (
      <>
        <Link href={`/${props.post.author}/posts/${props.post.slug}`}>
          <a className="w-full py-3 text-xl font-extrabold text-black" title={props.post.title}>
            <p className="break-all">{props.post.title}</p>
          </a>
        </Link>
        <Link href={`/${props.post.author}`}>
          <a>
            <div className="flex items-center mt-1">
              {props.post.icon !== "" && (
                <img className="h-8 w-8 rounded-full" src={props.post.icon} alt={props.post.authorName} />
              )}
              {props.post.icon === "" && <FaUserCircle className="h-8 w-8" />}
              <div className="ml-2">
                <p>{props.post.authorName}</p>
                <div className="flex items-center">
                  <MdUpdate />
                  <p className="ml-1 text-sm font-light">{moment(new Date(props.post.date)).fromNow()}</p>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </>
    ) : (
      <Link href={`/${props.post.author}/posts/${props.post.slug}`}>
        <a className="w-full py-3 text-xl font-extrabold text-black" title={props.post.title}>
          <p className="break-all">{props.post.title}</p>
          <div className="flex items-center mt-1">
            <MdUpdate />
            <p className="ml-1 text-sm font-light">{moment(new Date(props.post.date)).fromNow()}</p>
          </div>
        </a>
      </Link>
    )}
  </div>
);

export default PostCard;
