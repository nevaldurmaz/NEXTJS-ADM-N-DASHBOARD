import { FC } from "react";
import Input from "./input";
import { BiSolidBellRing } from "react-icons/bi";

import Image from "next/image";

const Header: FC = () => {
  return (
    <header className="border-b border-zinc-300 p-2 bg-white flex justify-between">
      <Input />

      <div className="flex gap-5 items-center">
        <BiSolidBellRing className="text-xl cursor-pointer" />

        <div className="flex gap-3">
          <Image
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
            width={50}
            height={50}
            alt="profile"
            className="size-12 rounded-full"
          />

          <div>
            <p className="font-semibold">Neval Durmaz</p>
            <p>Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
