"use client"
import React from "react";

import LogoWithDescription from "./components/mainPage/middlepart/logoWithDescription";
import Footer from "./components/mainPage/footer/footer";
import Chatbot from "./components/mainPage/middlepart/chatbot";
import HeaderPlusMarquee from "./components/mainPage/header components/headerplusMarquee";
import LeagueInfo from "./components/mainPage/leagues/individualLeague";
import SelectLeague from "./components/fixtureDisplay/selectLeague";






export default function Home() {
  return (
    <div>
      <HeaderPlusMarquee/>
      <LogoWithDescription/>
      <LeagueInfo/>
      <Chatbot/>
      <Footer/>    
    </div>
  );
}
