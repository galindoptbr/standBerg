"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

import { Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";

import Img1 from "@/assets/images/event1.png";
import Img2 from "@/assets/images/event2.png";
import Img3 from "@/assets/images/event3.png";
import Img4 from "@/assets/images/event4.png";
import Img5 from "@/assets/images/event5.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AboutPage: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="flex gap-2 pt-10 pl-10  m-auto max-w-[1200px] ">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/"
              replace
              className={`transition-colors duration-300 ${
                pathname === "/"
                  ? "text-yellow-500"
                  : "text-zinc-400 hover:text-yellow-500"
              }`}
            >
              Início /
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`transition-colors duration-300 ${
                pathname === "/catalog"
                  ? "text-yellow-500"
                  : "text-zinc-400 hover:text-yellow-500"
              }`}
            >
              Sobre
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <div className="flex flex-col m-auto text-center mt-12 max-w-[956px]">
          <p className="text-3xl font-semibold">Sobre a Olavo Scale Wheels</p>
          <p className="text-zinc-400 mt-6 p-2 lg:p-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut aperiam
            eaque dolores, eos aliquam ipsa, accusantium perferendis at ut unde
            modi expedita. Tempore voluptate quod adipisci exercitationem
            perferendis error quo? Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Suscipit veniam quidem aut aperiam voluptate totam
            ad quaerat doloribus, magnam dolores unde rem? Vitae dicta odit quos
            expedita, dolorem maxime ab!
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full border-0 rounded-2xl p-2 lg:p-0"
              src="https://www.youtube.com/embed/1UijpiPv2yA"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="flex flex-col text-center mt-12">
          <p className="text-3xl font-semibold">Veja onde já estivemos</p>
          <p className="text-zinc-400 max-w-[956px] m-auto mt-6 p-2 lg:p-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
            aliquam voluptatem quod itaque quas vel accusamus nam accusantium
            tempore quaerat molestiae corrupti, suscipit, deleniti porro
            doloribus reprehenderit ipsum inventore odit. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Necessitatibus quas placeat, odio
            aliquid voluptas iure mollitia ratione illo est incidunt nemo
            deserunt harum sunt eaque voluptatum, labore ut temporibus eum?
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10 p-2 lg:p-0">
          <Swiper
            cssMode={true}
            navigation={true}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="mySwiper rounded-2xl"
          >
            <SwiperSlide>
              <Image src={Img1} alt="Img 1" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src={Img2} alt="Img 1" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src={Img3} alt="Img 1" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src={Img4} alt="Img 1" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src={Img5} alt="Img 1" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
