import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>,
);
