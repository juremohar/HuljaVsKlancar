import React from "react";

function PlayerCard({ player, isUyoAhead, badges }) {
  const getRankImage = (player) => {
    if (
      player.summonerId ===
      "OtWo2_PcBVU-YrOzJFeSiMO-NBQmMLIFXfT3H91GoFqshNzrgh98tiX4kQ"
    ) {
      const imagePath = `./uyo/uyo_rank${player.rank}.png`;

      return imagePath;
    } else if (
      player.summonerId ===
      "5A5SjVdCxy6ZQfVOTD3UDvjRL9BIMIucOw2WUrPC6fV6ex3P7NVvcJaRJg"
    ) {
      const imagePath = `./hulja/hulja_rank${player.rank}.png`;

      return imagePath;
    }
  };

  function calculateWinPercentage(wins, losses) {
    const totalGames = wins + losses;
    const winPercentage = (wins / totalGames) * 100;

    return winPercentage.toFixed(2);
  }

  return (
    <div
      className={`max-w-sm text-white rounded shadow-lg order-1 lg:order-2 ${
        isUyoAhead ? "bg-emerald-600" : "bg-red-500"
      }`}>
      <div className="flex justify-center">
        <img
          className="w-[380px] h-[516px] rounded-t"
          src={getRankImage(player)}
        />
      </div>

      <div className="w-full flex justify-between items-center px-6 py-4">
        <div>
          <div className="font-bold text-xl mb-2">{player.name}</div>
          <p className="text-base">
            <span>W: </span>
            {player.wins} <span>L:</span> {player.losses} (
            {calculateWinPercentage(player.wins, player.losses)}%)
          </p>

          <p>Total games: {player.wins + player.losses} </p>

          <p className="font-bold">
            {player.tier} {player.rank} {player.leaguePoints}LP
          </p>
        </div>

        <div className="flex justify-center items-center">
          <img
            className="w-20 h-20 rounded-full object-fill"
            src={player.profilePic}
          />
        </div>
      </div>

      {badges}
    </div>
  );
}

export default PlayerCard;
