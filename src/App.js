import "./App.css";
import React, { useState, useEffect } from "react";
import MatchHistory from "./components/MatchHistory";
import PlayerCard from "./components/PlayerCard";

const huljaId = "exstIThz-0IskkMxv5xjFz9Vh7aWOEu2tkwGlc1Y6oVCgleGd8eCNCS9kA";
const klancarId = "NgCTXsGabUC1EhI22vTsKran3viNVf-Escikl-T4m3q9D9qh6H9sKqGkng";
const secret = "RGAPI-dcad6322-ebb7-44ca-b770-670dd49fb9f3";
const huljaPUUID =
  "8Blt358BdVCUPZrtBRuUxpV13W5K-46YTWrM3oosyE6yqvWUYtJzartepXcvkxf9G-x14kHPQxfx5Q";
const klancarPUUID =
  "40HL-EeJhwe0xoa84TBfidvDvSab8va_-nhcezP88nbuFOg1Tz1HRiZnJPkOe-unJO8gKXTbce0sPw";

const LP_PER_WIN = 24;

async function fetchRiotId(puuid) {
  const response = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}?api_key=${secret}`
  );
  return await response.json();
}

async function fetchApiData(id) {
  const response = await fetch(
    "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/" +
      id +
      "?api_key=" +
      secret
  );
  return await response.json();
}

const calculateLP = (player) => {
  const rankValues = {
    IV: 0,
    III: 1,
    II: 2,
    I: 3,
  };

  const tierValues = {
    DIAMOND: 5,
    EMERALD: 4,
    PLATINUM: 3,
    GOLD: 2,
    SILVER: 1,
    BRONZE: 0,
  };

  return (
    (tierValues[player.tier] * 4 + rankValues[player.rank]) * 100 +
    player.leaguePoints
  );
};

const calculateRankDifference = (player1, player2) => {
  const lpDifference = calculateLP(player2) - calculateLP(player1);
  const leadingPlayer = lpDifference >= 0 ? player2 : player1;
  const winsDifference = Math.ceil(Math.abs(lpDifference / LP_PER_WIN));

  return {
    winsDifference: winsDifference,
    leadingPlayer: leadingPlayer,
  };
};

const isUyoAhead = (rankDifResult) =>
  rankDifResult.leadingPlayer.summonerName === "utvryis";

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [klancarData, setKlancarData] = useState(null);
  const [huljaData, setHuljaData] = useState(null);
  const [klancarRiotId, setKlancarRiotId] = useState(null);
  const [huljaRiotId, setHuljaRiotId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const r1 = await fetchApiData(klancarId);
      setKlancarData(() => {
        return {
          ...r1.find((x) => x.queueType == "RANKED_SOLO_5x5"),
          name: klancarRiotId.gameName + "#" + klancarRiotId.tagLine,
          profilePic: "./uyo/profilka.png",
        };
      });

      const r2 = await fetchApiData(huljaId);
      setHuljaData(() => {
        return {
          ...r2.find((x) => x.queueType == "RANKED_SOLO_5x5"),
          name: huljaRiotId.gameName + "#" + huljaRiotId.tagLine,
          profilePic: "./hulja/profilka.png",
        };
      });

      const klancarRiotIdData = await fetchRiotId(klancarPUUID);
      setKlancarRiotId(klancarRiotIdData);

      const huljaRiotIdData = await fetchRiotId(huljaPUUID);
      setHuljaRiotId(huljaRiotIdData);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const rankDifResult = calculateRankDifference(klancarData, huljaData);

  const uyoBadges = (
    <div className="px-6 pt-4 pb-2">
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #midgap
      </span>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #fizzenjoyer &#128011;
      </span>
    </div>
  );

  const huljaBadges = (
    <div className="px-6 pt-4 pb-2">
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #junglediff
      </span>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #yonenjoyer &#129326;
      </span>
      <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        #npc
      </span>
    </div>
  );

  return (
    <div className="relative isolate py-4 text-white">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-500 to-sky-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="container mx-auto">
        <div className="flex justify-around items-center mb-10 flex-col lg:flex-row lg:space-x-4">
          <div className="flex-col place-self-start space-y-1 order-2 max-w-sm m-auto w-full flex py-2 lg:py-0 lg:px-2 lg:m-0 lg:order-1 lg:w-80">
            <MatchHistory userPUUID={klancarPUUID} />
          </div>

          <div className="order-1 lg:order-2">
            <PlayerCard
              player={klancarData}
              isUyoAhead={isUyoAhead(rankDifResult)}
              badges={uyoBadges}
            />
          </div>

          <div className="py-2 order-3 text-xl text-white px-2">VS</div>

          <div className="order-4 lg:order-4">
            <PlayerCard
              player={huljaData}
              isUyoAhead={!isUyoAhead(rankDifResult)}
              badges={huljaBadges}
            />
          </div>

          <div className="flex-col place-self-start space-y-1 order-5 max-w-sm m-auto w-full flex py-2 lg:py-0 lg:px-2 lg:m-0 lg:w-80">
            <MatchHistory userPUUID={huljaPUUID} />
          </div>
        </div>

        <div className="px-6 py-12 md:py-36">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-semibold leading-7 text-indigo-400">
              Leader
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
              {rankDifResult.leadingPlayer.name}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              approximately {rankDifResult.winsDifference} wins ahead
            </p>
          </div>

          <div className="flex justify-center py-4">
            <img
              src={
                isUyoAhead(rankDifResult)
                  ? "./uyo/uyo_leader.png"
                  : "./hulja/hulja_leader.png"
              }
              className="card-img-top rounded"
            />
          </div>
        </div>
      </div>

      <div
        className="hidden lg:block absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-1000px)]"
        aria-hidden="true">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-sky-500 to-emerald-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <MyComponent />
    </div>
  );
}

export default App;
