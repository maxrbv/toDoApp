import AppRouter from "./components/AppRouter";
import { useState } from "react";
import { UserContext } from "./context"

function App({data}) {
  const [Data, setData] = useState(data)
  return (
    <UserContext.Provider value={[Data, setData]}>
    <AppRouter/>
    </UserContext.Provider>
  );
}
export default App;
