import { BrowserRouter } from "react-router-dom"
import AppRouter from "./router/AppRouter"
import { useEffect } from "react"
import { useAppDispatch } from "./redux/hook"
import { useSelector } from "react-redux"
import { getBusinessDetails } from "./redux/slice/authSlice"
import type { RootState } from "./redux/store"


const App = () => {
  const dispatch = useAppDispatch();
  const { businessDetails } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getBusinessDetails());
  }, [dispatch]);

  useEffect(() => {
    if (businessDetails?.theme_color) {
      document.documentElement.style.setProperty('--primary-color', businessDetails.theme_color);
    } else {
      document.documentElement.style.setProperty('--primary-color', '#1d67a6');
    }
  }, [businessDetails?.theme_color]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App