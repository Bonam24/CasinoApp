"use client"
import React from "react";

import LogoWithDescription from "./components/mainPage/middlepart/logoWithDescription";
import Footer from "./components/mainPage/footer/footer";
import Chatbot from "./components/mainPage/middlepart/chatbot";
import HeaderPlusMarquee from "./components/mainPage/header components/headerplusMarquee";
import LeagueCard from "./components/mainPage/middlepart/displaySportsLeagueAndTabs/leagueCard";




export default function Home() {
  return (
    <div>
      <HeaderPlusMarquee/>
      <LogoWithDescription/>
      <LeagueCard/>
      <Chatbot/>
      <Footer/>    
    </div>
  );
}
