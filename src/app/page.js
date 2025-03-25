"use client"
import React from "react";

import LogoWithDescription from "./components/mainPage/middlepart/logoWithDescription";
import Footer from "./components/mainPage/footer/footer";
import Chatbot from "./components/mainPage/middlepart/chatbot";
import HeaderPlusMarquee from "./components/mainPage/header components/headerplusMarquee";
import LeagueInfo from "./components/mainPage/leagues/individualLeague";
import SportsTabs from "./components/mainPage/leagues/tabbedView";
import SportsLeaguesCombined from "./components/mainPage/leagues/combinedTabsAndLeagueDisplay";








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
