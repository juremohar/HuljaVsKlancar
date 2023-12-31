import "./App.css";
import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";

const huljaId = "exstIThz-0IskkMxv5xjFz9Vh7aWOEu2tkwGlc1Y6oVCgleGd8eCNCS9kA";
const klancarId = "NgCTXsGabUC1EhI22vTsKran3viNVf-Escikl-T4m3q9D9qh6H9sKqGkng";
const secret = "RGAPI-dcad6322-ebb7-44ca-b770-670dd49fb9f3";

const LP_PER_WIN = 20;

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
  };

  return (
    tierValues[player.tier] * 1000 +
    rankValues[player.rank] * 100 +
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

const getRankImage = (player) => {
  if (player.summonerName === "utvryis") {
    const imagePath = `./uyo/uyo_rank${player.rank}.png`;

    return imagePath;
  } else if (player.summonerName === "prytaijo") {
    const imagePath = `./hulja/hulja_rank${player.rank}.png`;

    return imagePath;
  }
};

const isUyoAhead = (rankDifResult) =>
  rankDifResult.leadingPlayer.summonerName === "utvryis";

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [klancarData, setKlancarData] = useState(null);
  const [huljaData, setHuljaData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const r1 = await fetchApiData(klancarId);
      setKlancarData(() => {
        return {
          ...r1.find((x) => x.queueType == "RANKED_SOLO_5x5"),
          name: "Matevž Klančar",
        };
      });

      const r2 = await fetchApiData(huljaId);
      setHuljaData(() => {
        return {
          ...r2.find((x) => x.queueType == "RANKED_SOLO_5x5"),
          name: "Luka Grm",
        };
      });

      setLoading(false);
    };

    fetchData();
  }, []); // The empty dependency array ensures that the effect runs only once, similar to componentDidMount

  if (loading) {
    return <p>Loading...</p>;
  }

  const rankDifResult = calculateRankDifference(klancarData, huljaData);

  return (
    <div className="container mx-auto">
      <div className="flex justify-around items-center mb-10 flex-col sm:flex-row px-4 py-6">
        <div
          className={`max-w-sm rounded overflow-hidden shadow-lg ${
            isUyoAhead(rankDifResult) ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <img
            className="w-[380px] h-[516px]"
            src={getRankImage(klancarData)}
            alt="Sunset in the mountains"
          />

          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <div className="font-bold text-xl mb-2">Matevž Klančar</div>
              <p className="text-gray-700 text-base">
                <span className="font-bold">W: </span>
                {klancarData.wins} <span className="font-bold">L:</span>{" "}
                {klancarData.losses}
              </p>
              <p className="text-gray-700 text-base">
                <span className="font-bold">
                  {klancarData.tier} {klancarData.rank}{" "}
                  {klancarData.leaguePoints}LP
                </span>
              </p>
            </div>
            <div>
              <img
                className="w-16 h-16 rounded-full"
                src="https://scontent.flju4-1.fna.fbcdn.net/v/t39.30808-6/261420619_5149674351726442_2866608884541755962_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=Tb5FgpL_TJAAX9I6Fe2&_nc_ht=scontent.flju4-1.fna&oh=00_AfCz3wvGEkeBKmkDuVBazD6gupS6pbirsdA1Lp2Wm6xsug&oe=6590948F"
                alt="Sunset in the mountains"
              />
            </div>
          </div>

          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #midgap
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #fizzenjoyer &#128011;
            </span>
          </div>
        </div>
        <div className="py-5">VS</div>
        <div
          className={`max-w-sm rounded overflow-hidden shadow-lg ${
            !isUyoAhead(rankDifResult) ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <img
            className="w-[380px] h-[516px]"
            src={getRankImage(huljaData)}
            alt="Sunset in the mountains"
          />
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <div className="font-bold text-xl mb-2">Luka Grm</div>
              <p className="text-gray-700 text-base">
                <span className="font-bold">W: </span>
                {huljaData.wins} <span className="font-bold">L:</span>{" "}
                {huljaData.losses}
              </p>
              <p className="text-gray-700 text-base">
                <span className="font-bold">
                  {huljaData.tier} {huljaData.rank} {huljaData.leaguePoints}LP
                </span>
              </p>
            </div>
            <div>
              <img
                className="w-16 h-16 rounded-full"
                src="https://scontent.flju4-1.fna.fbcdn.net/v/t39.30808-6/274655961_4908160265970802_8342647707832605489_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=vRsuGfGEzhEAX8LtS7L&_nc_ht=scontent.flju4-1.fna&oh=00_AfAePZnh9jyh3bhdeboIZXkklWhz9XhZqCpfgbKa_SUOSQ&oe=6590FCAD"
                alt="Sunset in the mountains"
              />
            </div>
          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #junglediff
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #yonenjoyer &#129326;
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #npc
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center py-8 text-2xl">
        <h2 className="font-bold p-2">Time left:</h2>
        <Countdown date={new Date(2024, 0, 10, 0, 0, 0, 0)} />
      </div>

      <div className="bg-white px-6 py-12 md:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Leader
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {rankDifResult.leadingPlayer.name}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            approximately {rankDifResult.winsDifference} games ahead
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
