import type { FC } from "react";
import Link from "next/link";

import { FaLink, FaGithub, FaTwitter, FaUserCircle } from "react-icons/fa";

type Props = {
  Author: string;
  AuthorName: string;
  IconURL: string;
  Bio: string;
  SiteURL: string;
  GitHubID: string;
  TwitterID: string;
  Roles: string[];
};

const AuthorProfile: FC<Props> = (props) => {
  const { Author: AuthorID, AuthorName, IconURL, Bio, SiteURL, GitHubID, TwitterID, Roles } = props;
  const isIconURL = IconURL !== "";
  const isSiteURL = SiteURL !== "";
  const isGitHubID = GitHubID !== "";
  const isTwitterID = TwitterID !== "";

  return (
    <div className="bg-white flex items-start w-full">
      <Link href={`/${AuthorID}/`}>
        <a>
          {isIconURL && <img className="h-12 w-12 sm:h-16 sm:w-16 rounded-full" src={IconURL} alt={AuthorName} />}
          {!isIconURL && <FaUserCircle className="h-12 w-12 sm:h-16 sm:w-16" />}
        </a>
      </Link>
      <div className="ml-4">
        <div className="sm:flex justify-start items-center">
          <Link href={`/${AuthorID}/`}>
            <a>
              <p className="text-lg font-black">{AuthorName}</p>
            </a>
          </Link>
          <div className="mx-2 text-sm flex items-end flex-wrap">
            {Roles.map((value) => (
              <p className="mx-1 p-1 bg-gray-300 rounded-md break-all" key={value}>
                {value}
              </p>
            ))}
          </div>
        </div>
        <div className="my-3 break-all">{Bio}</div>
        <div className="sm:flex justify-start items-center">
          {isSiteURL && (
            <div className="mr-4">
              <Link href={SiteURL}>
                <a target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center">
                    <FaLink className="pr-1 text-xl" />
                    {SiteURL.match(/([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/g)}
                  </div>
                </a>
              </Link>
            </div>
          )}
          {isGitHubID && (
            <div className="mr-4">
              <Link href={`https://github.com/${GitHubID}`}>
                <a target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center">
                    <FaGithub className="pr-1 text-xl" />
                    {GitHubID}
                  </div>
                </a>
              </Link>
            </div>
          )}
          {isTwitterID && (
            <div className="mr-4">
              <Link href={`https://twitter.com/${TwitterID}`}>
                <a target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center">
                    <FaTwitter className="pr-1 text-xl" />
                    {TwitterID}
                  </div>
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
