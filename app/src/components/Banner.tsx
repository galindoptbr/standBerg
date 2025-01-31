"use client";

import Image from "next/image";
import React from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Scrollbar } from "swiper/modules";

import banner1 from "../assets/images/banner-about1.png";
import banner2 from "../assets/images/banner-about2.png";
import banner3 from "../assets/images/banner-about4.png";

export const Banner = () => {
  return (
    <>
      <div className="pt-14 md:pt-28">
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          scrollbar={{
            hide: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[EffectFade, Autoplay, Scrollbar]}
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
    </>
  );
};
