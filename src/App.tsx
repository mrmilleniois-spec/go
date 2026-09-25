import { useApp } from "./AppContext";
import { PassengerApp } from "./passenger/PassengerApp";
import { BusinessApp } from "./business/BusinessApp";
import { Toasts } from "./components/Toasts";

export default function App() {
  const { mode } = useApp();
  return (
    <div className="phone">
      {mode === "business" ? <BusinessApp /> : <PassengerApp />}
      <Toasts />
    </div>
  );
}