import React, { useEffect, useState } from "react";

async function fetchMatchHistory(id, retries = 3, delay = 1000) {
  try {
    const response = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=RGAPI-dcad6322-ebb7-44ca-b770-670dd49fb9f3`
    );

    if (response.status === 429 && retries > 0) {
      // Too Many Requests (429), retry after a delay
      console.log(`Retrying after ${delay} ms. Retries left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchMatchHistory(id, retries - 1, delay * 2);
    }

    return await response.json();
  } catch (e) {
    console.error("Error:", e);
  }
}

function MatchHistoryCard({ matchId, userPUUID }) {
  const [loading, setLoading] = useState(true);
  const [matchHistory, setMatchHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchMatchHistory(matchId);

      setMatchHistory(response);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const findPlayer = matchHistory?.info?.participants?.find(
    (participant) => participant.puuid === userPUUID
  );

  const itemsArray = [
    findPlayer?.item0,
    findPlayer?.item1,
    findPlayer?.item2,
    findPlayer?.item3,
    findPlayer?.item4,
    findPlayer?.item5,
  ];

  if (!matchHistory) return <div>rate limited</div>;

  return (
    <div
      className={`w-full flex space-x-5 items-center py-2 rounded px-4 ${
        findPlayer?.win ? "bg-blue-400" : "bg-red-400"
      }`}
    >
      <img
        className="w-12 h-12 rounded"
        src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${findPlayer?.championName}.png`}
      />

      <div className="flex flex-col">
        <div className="text-sm text-slate-950 font-bold">Ranked solo</div>
        <div className="text-slate-700 font-bold text-xl py-1">
          {findPlayer?.kills} / {findPlayer?.deaths} / {findPlayer?.assists}
        </div>
        <div className="flex space-x-1">
          {itemsArray.map((item) =>
            item ? (
              <div key={item}>
                <img
                  className="w-8 h-7 rounded"
                  src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${item}.png`}
                />
              </div>
            ) : (
              <div className="w-8 h-7 rounded border-2 border-slate-800 bg-slate-800/50"></div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default MatchHistoryCard;
