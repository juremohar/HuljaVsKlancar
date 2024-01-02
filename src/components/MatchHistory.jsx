import React, { useEffect, useState } from "react";
import MatchHistoryCard from "./MatchHistoryCard";

async function fetchMatchHistory(id, retries = 3, delay = 1000) {
  try {
    const response = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${id}/ids?type=ranked&start=0&count=5&api_key=RGAPI-dcad6322-ebb7-44ca-b770-670dd49fb9f3`
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

function MatchHistory({ userPUUID }) {
  const [loading, setLoading] = useState(true);
  const [usersHistory, setUserHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setUserHistory(await fetchMatchHistory(userPUUID));

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return usersHistory?.map((matchId) => (
    <MatchHistoryCard matchId={matchId} userPUUID={userPUUID} key={matchId} />
  ));
}

export default MatchHistory;
