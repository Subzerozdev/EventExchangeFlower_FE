import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="1082844276097-aio45nb82o2rji8p33khg00umi6kcs9m.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
