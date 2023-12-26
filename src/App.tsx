import "./App.css";
import SearchForm from "./components/SearchForm";

function App() {
  return (
    <div className="container">
      <SearchForm onSubmit={(e) => console.log(e)}></SearchForm>
    </div>
  );
}

export default App;
