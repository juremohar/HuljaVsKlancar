import './App.css';
import React, { useState, useEffect } from 'react';

const huljaId = "9l-yPDfUNtkSPwHddbHJMM6iRUJiv-95de0jHMRSPltQYk4"
const klancarId = "x7pf45S36YLfn55xpk75WZtvoZ9oZ2YN3uhfbw6CRtT625pb1fS7qrFCHw"
const secret = "RGAPI-17481b17-b4b9-4a3a-bf13-cb28fbc36044"

async function fetchApiData(id) {
  const response = await fetch('https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id + '?api_key=' + secret);
  return await response.json();
}


function sortObjects(objects) {
  const tierOrder = { DIAMOND: 4, EMERALD: 3, GOLD: 2, SILVER: 1 };
  const rankOrder = { I: 4, II: 3, III: 2, IV: 1 };

  objects.sort((obj1, obj2) => {
    // Compare by tier
    if (tierOrder[obj1.tier] > tierOrder[obj2.tier]) {
      return -1; // Object 1 is higher
    } else if (tierOrder[obj1.tier] < tierOrder[obj2.tier]) {
      return 1; // Object 2 is higher
    }

    // If tier is the same, compare by rank
    if (rankOrder[obj1.rank] > rankOrder[obj2.rank]) {
      return -1; // Object 1 is higher
    } else if (rankOrder[obj1.rank] < rankOrder[obj2.rank]) {
      return 1; // Object 2 is higher
    }

    // If tier and rank are the same, compare by lp
    return obj2.lp - obj1.lp; // Higher lp comes first
  });

  return objects;
}

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [klancarData, setKlancarData] = useState(null);
  const [huljaData, setHuljaData] = useState(null);
  const [showWinning, setShowWinning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const r1 = await fetchApiData(klancarId);
      setKlancarData(r1.find((x) => x.queueType == "RANKED_SOLO_5x5"));

      const r2 = await fetchApiData(huljaId);
      setHuljaData(r2.find((x) => x.queueType == "RANKED_SOLO_5x5"));

      setLoading(false)
    };

    fetchData();
  }, []); // The empty dependency array ensures that the effect runs only once, similar to componentDidMount

  if (loading) {
    return <p>Loading...</p>
  }

  console.log(klancarData)

  let data = sortObjects([klancarData, huljaData]);

  let currentLeaderIs = data[0].summonerName
  console.log(data)

  return (
    <div className="container mx-auto">
      <div className="flex justify-around items-center mb-10 flex-col sm:flex-row">
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <img className="w-full" src="https://scontent.flju4-1.fna.fbcdn.net/v/t39.30808-6/261420619_5149674351726442_2866608884541755962_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=Tb5FgpL_TJAAX9I6Fe2&_nc_ht=scontent.flju4-1.fna&oh=00_AfCz3wvGEkeBKmkDuVBazD6gupS6pbirsdA1Lp2Wm6xsug&oe=6590948F" alt="Sunset in the mountains" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Matevž Klančar</div>
            <p className="text-gray-700 text-base">
              <span className='font-bold'>W: </span>{klancarData.wins} <span className='font-bold'>L:</span> {klancarData.losses}
            </p>
            <p className="text-gray-700 text-base">
              <span className='font-bold'>{klancarData.tier} {klancarData.rank} {klancarData.leaguePoints}LP</span>
            </p>
          </div>

          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#adcdiff</span>
          </div>

          <div className="px-6 pt-4 pb-2">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => {alert("Go Klančar!")}}>
              Cheer
            </button>
          </div>
        </div>

        VS

        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <img className="w-full" src="https://scontent.flju4-1.fna.fbcdn.net/v/t39.30808-6/274655961_4908160265970802_8342647707832605489_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=vRsuGfGEzhEAX8LtS7L&_nc_ht=scontent.flju4-1.fna&oh=00_AfAePZnh9jyh3bhdeboIZXkklWhz9XhZqCpfgbKa_SUOSQ&oe=6590FCAD" alt="Sunset in the mountains" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Luka Grm</div>
            <p className="text-gray-700 text-base">
              <span className='font-bold'>W: </span>{huljaData.wins} <span className='font-bold'>L:</span> {huljaData.losses}
            </p>
            <p className="text-gray-700 text-base">
              <span className='font-bold'>{huljaData.tier} {huljaData.rank} {huljaData.leaguePoints}LP</span>
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#junglediff</span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#yonenjoyer</span>
          </div>

          <div className="px-6 pt-4 pb-2">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => {alert("Go Hulja!")}}>
              Cheer
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => { setShowWinning(!showWinning) }}>
          Who is currently in the lead?
        </button>
      </div>

      {showWinning && currentLeaderIs == "Blesou človk" &&
        <div className="flex flex-col justify-around items-center">
          <h2 className="font-bold p-2">Its hulja!</h2>
          <img src="./hulja.jpeg" className="card-img-top" alt="Pionir" />
        </div>
      }

      {showWinning && currentLeaderIs == "utvryis" &&
        <div className="flex flex-col justify-around items-center">
          <h2 className="font-bold p-2">Its klančar!</h2>
          <img src="./klancar.png" className="card-img-top" alt="Pionir" />
        </div>
      }
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

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           test <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
