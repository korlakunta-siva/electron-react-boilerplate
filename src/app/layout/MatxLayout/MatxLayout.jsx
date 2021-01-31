import React, { useContext, useEffect, useRef } from "react";
import { MatxLayouts } from "./index";
import AppContext from "../../contexts/AppContext";
import { MatxSuspense } from "../MatxSuspense/MatxSuspense";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useSettings from '../../hooks/useSettings';

const MatxLayout = (props) => {
  const theme = useTheme();
  const appContext = useContext(AppContext);
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { settings, updateSettings } = useSettings();
  const ref = useRef({ appContext, isMdScreen, settings });
  const Layout = MatxLayouts[settings.activeLayout];

  useEffect(() => {
    let { settings } = ref.current;
    let sidebarMode = settings.layout1Settings.leftSidebar.mode;
    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen ? "close" : sidebarMode;
      updateSettings({ layout1Settings: { leftSidebar: { mode } } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMdScreen]);

  return (
    <MatxSuspense>
      <Layout {...props} />
    </MatxSuspense>
  );
};

export default MatxLayout;
