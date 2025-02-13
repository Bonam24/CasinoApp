import { useState } from "react";
import SportsFilter from "./tabsOfSports";
import TestLeague from "./leagueDisplay";

export default function SportsLeaguePage() {
  const [apiUrl, setApiUrl] = useState("");

  return (
    <div>
      <SportsFilter onSelectSport={setApiUrl} />
      <TestLeague apiUrl={apiUrl} />
    </div>
  );
}
