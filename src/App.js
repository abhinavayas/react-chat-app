import { useDispatch } from "react-redux";
import { useEffect } from "react";
import "./styles.css";
import { systemsActions } from "./store/systemsSlice";
import Auth from "./components/auth";

export default function App() {
  const dispatch = useDispatch();
  dispatch(
    systemsActions.setWidth(
      Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      )
    )
  );
  useEffect(() => {
    function setDIM() {
      dispatch(
        systemsActions.setWidth(
          Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
          )
        )
      );
    }
    window.addEventListener("resize", setDIM);
  });

  return (
    <div>
      <Auth />
    </div>
  );
}
