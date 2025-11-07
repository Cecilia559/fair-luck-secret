import { useState } from "react";
import RaffleCard from "./RaffleCard";
import EntryModal from "./EntryModal";

interface Raffle {
  id: string;
  name: string;
  prize: string;
  totalEntries: number;
  timeRemaining: string;
  isActive: boolean;
}

const mockRaffles: Raffle[] = [
  {
    id: "1",
    name: "Mega Crypto Raffle",
    prize: "10 ETH",
    totalEntries: 247,
    timeRemaining: "2d 14h",
    isActive: true,
  },
  {
    id: "2",
    name: "NFT Collection Draw",
    prize: "Rare NFT Bundle",
    totalEntries: 189,
    timeRemaining: "1d 8h",
    isActive: true,
  },
  {
    id: "3",
    name: "Token Holder Raffle",
    prize: "5 ETH",
    totalEntries: 412,
    timeRemaining: "18h 32m",
    isActive: true,
  },
  {
    id: "4",
    name: "Community Raffle",
    prize: "3 ETH",
    totalEntries: 156,
    timeRemaining: "3d 2h",
    isActive: true,
  },
];

const RaffleBoard = () => {
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);

  const handleEnterRaffle = (raffle: Raffle) => {
    setSelectedRaffle(raffle);
  };

  const handleCloseModal = () => {
    setSelectedRaffle(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-foreground">Active Raffles</h2>
        <p className="text-muted-foreground">
          Join any raffle with encrypted entries. Your entry amount stays private until the draw.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockRaffles.map((raffle) => (
          <RaffleCard
            key={raffle.id}
            {...raffle}
            onEnter={() => handleEnterRaffle(raffle)}
          />
        ))}
      </div>

      {selectedRaffle && (
        <EntryModal
          isOpen={!!selectedRaffle}
          onClose={handleCloseModal}
          raffle={selectedRaffle}
        />
      )}
    </div>
  );
};

export default RaffleBoard;
