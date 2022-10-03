import Menus from "./components/Menus";
import React from "react";
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";
import { routes } from "../../utils/routes";

const Sidebar = (props) => {
  const { sidebar, setSidebar, header } = props;
  return (
    <>
      <SidebarDesktop header={header} sidebar={sidebar} setSidebar={setSidebar}>
        <Menus routes={routes} />
      </SidebarDesktop>
      <SidebarMobile header={header} sidebar={sidebar} setSidebar={setSidebar}>
        <Menus routes={routes} />
      </SidebarMobile>
    </>
  );
};

export default Sidebar;
