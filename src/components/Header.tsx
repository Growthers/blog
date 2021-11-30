import type { FC } from "react";
import Link from "next/link";

const Header: FC = () => (
  <div className="bg-white p-3 sm:p-6 flex items-center">
    <div>
      <Link href="/">
        <a className="flex justify-center items-center">
          <img className="rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" src="/growthers.png" alt="growthers" />
          <p className="ml-1 md:ml-2 text-sm sm:text-lg md:text-xl">共同開発鯖 - Blog</p>
        </a>
      </Link>
    </div>
    <div className="px-4 sm:px-8 lg:px-12 text-sm sm:text-base md:text-lg">
      <Link href="/">
        <a>Top</a>
      </Link>
    </div>
  </div>
);

export default Header;
