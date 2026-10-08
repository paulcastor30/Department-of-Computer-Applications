import { createRoot } from "react-dom/client";
import { FormVisitProvider } from "./components/FormVisitProvider";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<FormVisitProvider><App /></FormVisitProvider>);