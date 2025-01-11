"use client";

import Image from "next/image";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import { BsCarFront } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { PiChatBold } from "react-icons/pi";

import banner1 from "../assets/images/banner-about1.png";
import banner2 from "../assets/images/banner-about2.png";
import banner3 from "../assets/images/banner-about3.png";

export const Banner = () => {
  return (
    <>
      <div className="pt-16">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <Image className="w-full" src={banner1} alt="banner 1" />
          </SwiperSlide>
          <SwiperSlide>
            <Image className="w-full" src={banner2} alt="banner 1" />
          </SwiperSlide>
          <SwiperSlide>
            <Image className="w-full" src={banner3} alt="banner 1" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="hidden lg:block w-full h-20 bg-zinc-300">
        <div className="flex justify-center gap-4">
          <div className="flex items-center mt-6 gap-4 text-zinc-700 border-e-2 border-zinc-400">
            <PiChatBold size={25} />
            <p className="font-semibold text-md mr-4">Vendedor qualificado </p>
          </div>
          <div className="flex items-center mt-6 gap-4 text-zinc-700 border-e-2 border-zinc-400">
            <BsCarFront size={25} />
            <p className="font-semibold text-md mr-4">Marcas de qualidade </p>
          </div>
          <div className="flex items-center mt-6 gap-4 text-zinc-700">
            <BiLike size={25} />
            <p className="font-semibold text-md">Confiança e transparência </p>
          </div>
        </div>
      </div>
    </>
  );
};
