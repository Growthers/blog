import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import logo from "public/growthers.png";

const Header: FC = () => (
  <div className="bg-white p-4 px-20 flex items-center">
    <div>
      <Link href="/">
        <a className="flex justify-center items-center">
          <Image className="rounded-full h-12 w-12" src={logo} alt="growthers" width={45} height={45} />
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
