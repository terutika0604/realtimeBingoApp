import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Master from "./routes/Master";
import Children from "./routes/Children";
import CreateRoom from "./routes/CreateRoom";
import NotFound from "./routes/NotFound";
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/master/:roomId/:roomName/:userName`} element={<Master />} />
        <Route path={`/children/:roomId/:roomName/:userName`} element={<Children />} />
        <Route path={`/create_room/`} element={<CreateRoom />} />
        <Route path={`*`} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;



