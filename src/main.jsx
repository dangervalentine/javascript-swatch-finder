import { createRoot } from "react-dom/client";
import { getInitialTheme, setTheme } from "./theme";
import App from "./App";

setTheme(getInitialTheme());
createRoot(document.getElementById("root")).render(<App />);
