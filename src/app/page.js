"use client"
import React from "react";

import LogoWithDescription from "./components/middlepart/logoWithDescription";
import HeaderPlusMarquee from "./components/header components/headerplusMarquee";
import Footer from "./components/footer/footer";
import Chatbot from "./components/middlepart/chatbot";
import Leagues from "./components/middlepart/testLeague";
import TabsOfSports from "./components/middlepart/tabsOfSports";

export default function Home() {
  return (
    <div>
      <HeaderPlusMarquee/>
      <LogoWithDescription/>
      <Chatbot/>
      <TabsOfSports/>
      <Leagues/>
      <Footer/>    
    </div>
  );
}
