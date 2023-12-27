import "./App.css";
import Clips from "./components/Clips";
import SearchForm from "./components/SearchForm";

function App() {
  return (
    <div className="container">
      <SearchForm onSubmit={(e) => console.log(e)}></SearchForm>
      <Clips></Clips>
    </div>
  );
}

export default App;
