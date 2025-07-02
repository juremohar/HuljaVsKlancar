import React, { useEffect, useState } from "react";
import TimeAgo from "react-timeago";

async function fetchMatchHistory(id, retries = 3, delay = 1000) {
  try {
    const response = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${id}?api_key=RGAPI-dcad6322-ebb7-44ca-b770-670dd49fb9f3`
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

  if (!matchHistory) return <div>rate limited</div>;

  const getBadge = (player) => {
    if (
      player?.doubleKills ||
      player?.tripleKills ||
      player?.quadraKills ||
      player?.pentaKills
    ) {
      let killText = "";

      if (player?.pentaKills) {
        killText = "Penta Kill";
      } else if (player?.quadraKills) {
        killText = "Quadra Kill";
      } else if (player?.tripleKills) {
        killText = "Triple Kill";
      } else if (player?.doubleKills) {
        killText = "Double Kill";
      }

      return (
        <span className="inline-flex items-center rounded-md bg-red-500 px-1.5 py-1 text-xs font-medium text-slate-100 ring-1 ring-inset ring-red-500/20">
          {killText}
        </span>
      );
    }

    if (player?.challenges?.soloKills) {
      return (
        <span className="inline-flex items-center rounded-md bg-indigo-500 px-1.5 py-1 text-xs font-medium text-slate-200 ring-1 ring-inset ring-pink-400/20">
          SOLO BOLO
        </span>
      );
    }

    return null;
  };

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

  const secondsToMinutesAndSeconds = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m${seconds}s`;
  };

  return (
    <div
      className={`w-full flex space-x-5 items-center py-2 rounded px-4 ${
        findPlayer?.win ? "bg-blue-600/80" : "bg-red-700/80"
      }`}>
      <div className="flex flex-col space-y-3">
        <img
          className="w-14 h-12 rounded"
          src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${findPlayer?.championName}.png`}
        />
        <div className="text-sm text-slate-200">
          <div>{findPlayer?.win ? "Victory" : "Defeat"}</div>
          <div className="text-xs">
            {secondsToMinutesAndSeconds(matchHistory.info.gameDuration)}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center text-xs text-slate-200">
          <div>Ranked solo</div>

          <div>
            <TimeAgo date={matchHistory.info.gameEndTimestamp} />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-slate-200 font-bold text-lg">
            {findPlayer?.kills} / {findPlayer?.deaths} / {findPlayer?.assists}
          </div>

          <div className="flex space-x-1">
            {getBadge(findPlayer)}

            {findPlayer?.gameEndedInSurrender && !findPlayer?.win && (
              <span className="inline-flex items-center rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-pink-400/20">
                FF
              </span>
            )}
          </div>
        </div>
        <div className="text-slate-200 text-sm">
          {findPlayer?.challenges.kda.toFixed(2)} KDA
        </div>
        <div className="flex space-x-1">
          {itemsArray.map((item, i) =>
            item ? (
              <div key={i}>
                <img
                  className="w-8 h-7 rounded"
                  src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/item/${item}.png`}
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
