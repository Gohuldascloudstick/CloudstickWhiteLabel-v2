import { BrowserRouter } from "react-router-dom"
import AppRouter from "./router/AppRouter"
const serverid = import.meta.env.VITE_serverId
console.log(serverid);

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App