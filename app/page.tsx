"use client";

import { NextPage } from "next";
import { Banner } from "./src/components/Banner";
import ProductList from "./src/components/ProductList";
import { Depositions } from "./src/components/Depositions";

const Home: NextPage = () => {
  return (
    <>
      <div>
        <Banner />
        <ProductList />
        <Depositions />
      </div>
    </>
  );
};

export default Home;
