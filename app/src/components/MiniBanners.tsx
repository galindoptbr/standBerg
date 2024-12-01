import Image from "next/image";
import React from "react";

import banner1 from "@/assets/images/mini-banner1.png";
import banner2 from "@/assets/images/mini-banner2.png";
import Link from "next/link";

export const MiniBanners = () => {
  return (
    <div className="flex flex-col p-2 justify-center gap-4 mt-10 lg:flex-row lg:mt-16">
      <Link href="/catalog">
        <Image className="rounded-xl" src={banner1} alt="banner 1" />
      </Link>
      <Link href="/catalog">
        <Image className="rounded-xl" src={banner2} alt="banner 1" />
      </Link>
    </div>
  );
};
