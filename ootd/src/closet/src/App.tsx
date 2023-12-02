import React from "react";
import Landing from "./components/Landing";
import "./App.css";

interface AppProps {
  email: string;
}

const App: React.FC<AppProps> = ({ email }) => {
  return (
    <>
      <Landing email={email} />
    </>
  );
};

export default App;
