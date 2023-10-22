import Container from "./pages/Container";
import HomePage from "./pages/HomePage"
import {Route,Routes} from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board" element={<Container />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
