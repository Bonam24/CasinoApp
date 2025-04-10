"use client"
import React from "react";

import LogoWithDescription from "./components/mainPage/middlepart/logoWithDescription";
import Footer from "./components/mainPage/footer/footer";
import Chatbot from "./components/mainPage/middlepart/chatbot";
import HeaderPlusMarquee from "./components/mainPage/header components/headerplusMarquee";
import SportsLeaguesCombined from "./components/mainPage/tabsAndLeagues/combinedTabsAndLeagueDisplay";









export default function Home() {
  return (
    <div>
      <HeaderPlusMarquee/>
      <LogoWithDescription/>
      <SportsLeaguesCombined/>
      <Chatbot/>
      <Footer/>    
    </div>
  );
}
