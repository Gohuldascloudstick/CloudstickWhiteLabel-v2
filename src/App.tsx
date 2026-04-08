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
      document.documentElement.style.setProperty('--brand-gradient', `linear-gradient(${businessDetails.theme_color}, ${businessDetails.theme_color})`);
    } else {
      document.documentElement.style.setProperty('--primary-color', '#1d67a6');
      document.documentElement.style.setProperty('--brand-gradient', 'linear-gradient(to right, #2168a1, #11999e)');
    }

    if (businessDetails?.primary_logo) {
      const link = (document.querySelector("link[rel*='icon']") || document.createElement('link')) as HTMLLinkElement;
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = businessDetails.primary_logo;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (businessDetails?.brand_name) {
      document.title = businessDetails.brand_name;
    }
  }, [businessDetails]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App