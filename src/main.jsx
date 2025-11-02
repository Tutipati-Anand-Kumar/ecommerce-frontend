import {createRoot} from "react-dom/client";
import App from "./App";
import "./index.css";
import { store } from './app/store'; 
import { Provider } from 'react-redux';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import React from "react";

createRoot(document.getElementById("root")).render(<React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>   
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>);