import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { BlogPage } from "./BlogPage";
import { FeaturesPage } from "./FeaturesPage";
import { HelpCenterPage, InterestPage } from "./ExternalPages";
import { ClientPortal } from "./ClientPortal";
import "./styles.css";

if (window.location.pathname === "/wizard") {
  window.location.replace("http://localhost:3333/wizard");
}

const Page = window.location.pathname === "/blog"
  ? BlogPage
  : window.location.pathname === "/funcionalidades"
    ? FeaturesPage
    : window.location.pathname === "/ajuda"
      ? HelpCenterPage
      : window.location.pathname.startsWith("/interesse/")
        ? InterestPage
        : window.location.pathname.startsWith("/cliente")
          ? ClientPortal
    : App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><Page /></React.StrictMode>
);
