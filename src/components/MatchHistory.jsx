import React, { useEffect, useState } from "react";
import MatchHistoryCard from "./MatchHistoryCard";

async function fetchMatchHistory(id, retries = 3, delay = 1000) {
  try {
    const response = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${id}/ids?queue=420&type=ranked&start=0&count=6&api_key=RGAPI-bb166ea2-f96d-4ea8-9851-1f9e4a031fd0`
    );

    if (response.status === 429 && retries > 0) {
      console.log(`Retrying after ${delay} ms. Retries left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchMatchHistory(id, retries - 1, delay * 2);
    }

    return await response.json();
  } catch (e) {
    console.error("Error:", e);
  }
}

function MatchHistory({ userNewPUUID, userOldPUUID }) {
  const [loading, setLoading] = useState(true);
  const [usersHistory, setUserHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setUserHistory(await fetchMatchHistory(userNewPUUID));

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return usersHistory?.map((matchId, i) => (
    <MatchHistoryCard matchId={matchId} userPUUID={userOldPUUID} key={i} />
  ));
}

export default MatchHistory;
