import type { FC } from "react";
import { EmailShareButton, LineShareButton, TwitterShareButton, EmailIcon, LineIcon, TwitterIcon } from "react-share";

type Props = {
  url: string;
  title: string;
};

const ShareButton: FC<Props> = (props) => {
  const { url, title } = props;
  return (
    <div className="my-2">
      <div className="flex flex-col justify-center mx-2">
        <p className="flex justify-center tracking-widest mb-1">SHARE</p>
        <hr className="w-full border border-black bg-black" />
      </div>
      <div className="flex justify-around mt-3">
        <TwitterShareButton className="" url={url} title={title} hashtags={["共同開発鯖"]}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LineShareButton url={url} title={title}>
          <LineIcon size={32} round />
        </LineShareButton>
        <EmailShareButton url={url} subject={title}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
    </div>
  );
};

export default ShareButton;
