"use client"
import React from "react";

import LogoWithDescription from "./components/middlepart/logoWithDescription";
import HeaderPlusMarquee from "./components/header components/headerplusMarquee";
import Footer from "./components/footer/footer";
import Chatbot from "./components/middlepart/chatbot";
//import Leagues from "./components/middlepart/displaySportsLeagueAndTabs/leagueDisplay";
//import TabsOfSports from "./components/middlepart/displaySportsLeagueAndTabs/tabsOfSports";

import LeagueSlider from "./components/middlepart/displayleaguelogo/slidingLeagueLogo";

export default function Home() {
  return (
    <div>
      <HeaderPlusMarquee/>
      <LogoWithDescription/>
      <LeagueSlider/>
      <Chatbot/>
      <Footer/>    
    </div>
  );
}
