import ListaParaVer from "./components/ListaParaVer";
import NuevoMedia from "./components/NuevoMedia";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return(
    <Router>
      <Routes>
        <Route path="/" element={<ListaParaVer />} />
        <Route path="/nuevo" element={<NuevoMedia />} />
      </Routes>
    </Router>
    );
}
export default App;
