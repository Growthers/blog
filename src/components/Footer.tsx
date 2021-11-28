import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import logo from "../../public/growthers.png";

const Footer: FC = () => (
  <div className="bg-white py-5 px-14">
    <div className="mt-5 flex justify-around items-start">
      <div>
        <Link href="/">
          <a className="flex justify-center items-center">
            <Image className="rounded-full h-12 w-12" src={logo} alt="growthers" width={45} height={45} />
            <p className="mx-2 text-lg">共同開発鯖 - Blog</p>
          </a>
        </Link>
      </div>
      <div>
        <p className="text-lg">Contents</p>
      </div>
      <div>
        <p className="text-lg">About</p>
        <ul>
          <li>
            <Link href="/">
              <a>このサイトについて</a>
            </Link>
          </li>
          <li>
            <Link href="/">
              <a>プライバシーポリシー</a>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <p className="text-lg">Growthers</p>
        <ul>
          <li>
            <Link href="/">
              <a target="_blank" rel="noopener noreferrer">
                HP
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://github.com/Growthers">
              <a target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://twitter.com/udcgrowthers">
              <a target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://www.youtube.com/channel/UCafZ6F2ZEyJMjcGbEzY0sVw">
              <a target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="mt-10 flex justify-center items-center">Copyright &copy; 2021 Growthers</div>
  </div>
);

export default Footer;
