import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import raffleLogo from "@/assets/raffle-logo.png";

interface HeaderProps {
  onConnectWallet: () => void;
  isConnected: boolean;
  walletAddress?: string;
}

const Header = ({ onConnectWallet, isConnected, walletAddress }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={raffleLogo} alt="Raffle Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">FHE Raffle</h1>
              <p className="text-xs text-muted-foreground">Fair Luck, Protected by FHE.</p>
            </div>
          </div>
          
          <Button 
            onClick={onConnectWallet}
            variant={isConnected ? "secondary" : "default"}
            className="gap-2"
          >
            <Wallet className="h-4 w-4" />
            {isConnected 
              ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
              : "Connect Wallet"
            }
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
