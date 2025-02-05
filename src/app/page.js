"use client"
import React from "react";

import LogoWithDescription from "./components/middlepart/logoWithDescription";
import HeaderPlusMarquee from "./components/header components/headerplusMarquee";
import SearchBar from "./components/middlepart/searchBar";
import DisplayAllTheItems from "./components/middlepart/displayAllTheItems";
import Footer from "./components/footer/footer";

export default function Home() {
  return (
    <div>
      <HeaderPlusMarquee/>
      <LogoWithDescription/>
      <SearchBar/>
      <DisplayAllTheItems/>
      <Footer/>
    </div>
  );
}
