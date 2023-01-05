import { BrowserRouter, Routes, Route } from "react-router-dom";
import ValidityTest from "./COMPONENTS/AUTH/ValidityTest";
import Nav from "./COMPONENTS/GLOBALS/Nav";
import Landing from "./PAGES/INIT/Landing";
import Login from "./PAGES/AUTH/Login";
import Signup from "./PAGES/AUTH/Signup";
import Verify from "./PAGES/AUTH/Verify";
import Standby from "./PAGES/AUTH/Standby";
import AllRooms from "./PAGES/COMMS/AllRooms";
import MyProfile from "./PAGES/COMMS/MyProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth">
          <Route path="l" element={<Login />} />
          <Route path="s" element={<Signup />} />
          <Route
            path="sb"
            element={
              <ValidityTest>
                <Standby />
              </ValidityTest>
            }
          />
          <Route
            path="v/:token"
            element={
              <ValidityTest>
                <Verify />
              </ValidityTest>
            }
          />
        </Route>
        <Route path="/comms" element={<Nav />}>
          <Route
            path="ar"
            element={
              <ValidityTest>
                <AllRooms />
              </ValidityTest>
            }
          />
          <Route
            path="dr"
            element={
              <ValidityTest>
                <AllRooms />
              </ValidityTest>
            }
          />
          <Route
            path="gr"
            element={
              <ValidityTest>
                <AllRooms />
              </ValidityTest>
            }
          />
          <Route
            path="ar/:room_code"
            element={
              <ValidityTest>
                <AllRooms />
              </ValidityTest>
            }
          />
          <Route
            path="dr/:room_code"
            element={
              <ValidityTest>
                <AllRooms />
              </ValidityTest>
            }
          />
          <Route
            path="gr/:room_code"
            element={
              <ValidityTest>
                <AllRooms />
              </ValidityTest>
            }
          />
          <Route
            path="mp"
            element={
              <ValidityTest>
                <MyProfile />
              </ValidityTest>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
