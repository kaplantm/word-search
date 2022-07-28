import "./App.scss";
import Game from "./components/Game";

function App() {
  // FUTURE: start/stop/reset/timer
  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordsearch</h1>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
