"use client";

import { NextPage } from "next";
import { useEffect } from "react";
import { Banner } from "./src/components/Banner";
import ProductList from "./src/components/ProductList";
import { Depositions } from "./src/components/Depositions";
import ProductTrend from "./src/components/ProductTrend";

const Home: NextPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <div>
        <Banner />
        <ProductTrend />
        <ProductList />
        <Depositions />
      </div>
    </>
  );
};

export default Home;
