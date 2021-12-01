import type { FC } from "react";
import Link from "next/link";

const Header: FC = () => (
  <div className="bg-white p-4 px-20 flex items-center">
    <div>
      <Link href="/">
        <a className="flex justify-center items-center">
          <img className="rounded-full h-12 w-12" src="/growthers.png" alt="growthers" />
          <p className="ml-2 text-lg">共同開発鯖 - Blog</p>
        </a>
      </Link>
    </div>
    <div className="px-20">
      <Link href="/">
        <a>Top</a>
      </Link>
    </div>
  </div>
);

export default Header;
