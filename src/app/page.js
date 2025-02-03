"use client"
import React from "react";
import HeaderCombine from "./components/header components/headerCombine"
import MarqueeEffect from "./components/header components/scrollingEffectElements"
import LogoWithDescription from "./components/middlepart/logoWithDescription";
import SearchBar from "./components/middlepart/searchBar";
import DisplayAllTheItems from "./components/middlepart/displayAllTheItems";
import Footer from "./components/footer/footer";

export default function Home() {
  return (
    <div>
      <HeaderCombine/>
      <MarqueeEffect/>
      <LogoWithDescription/>
      <SearchBar/>
      <DisplayAllTheItems/>
      <Footer/>
    </div>
  );
}
