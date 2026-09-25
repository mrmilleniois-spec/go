import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { IconAccount, IconHome, IconTrips, IconWallet } from "../components/Icons";
import { HomeScreen } from "./HomeScreen";
import { TripsScreen } from "./TripsScreen";
import { WalletScreen } from "./WalletScreen";
import { AccountScreen } from "./AccountScreen";
import { BusinessRegister } from "./BusinessRegister";

type Screen = "home" | "trips" | "wallet" | "account" | "register";

const NAV = [
  { key: "home", label: "Home", icon: <IconHome /> },
  { key: "trips", label: "Trips", icon: <IconTrips /> },
  { key: "wallet", label: "Wallet", icon: <IconWallet /> },
  { key: "account", label: "Account", icon: <IconAccount /> },
];

export function PassengerApp() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "register") {
    return <BusinessRegister onBack={() => setScreen("account")} />;
  }

  return (
    <>
      {screen === "home" && <HomeScreen onOpenAccount={() => setScreen("account")} />}
      {screen === "trips" && <TripsScreen />}
      {screen === "wallet" && <WalletScreen />}
      {screen === "account" && <AccountScreen onOpenRegister={() => setScreen("register")} />}
      <BottomNav
        items={NAV}
        active={screen}
        onChange={(k) => setScreen(k as Screen)}
      />
    </>
  );
}