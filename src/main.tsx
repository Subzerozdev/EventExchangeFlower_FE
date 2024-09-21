import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GoogleOAuthProvider clientId="1082844276097-aio45nb82o2rji8p33khg00umi6kcs9m.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);