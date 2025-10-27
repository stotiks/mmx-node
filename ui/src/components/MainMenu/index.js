import GuiMainMenu from "@/components/MainMenu/GuiMainMenu.vue";
import ExplorerMainMenu from "@/components/MainMenu/ExplorerMainMenu.vue";
import OfflineMainMenu from "@/components/MainMenu/OfflineMainMenu.vue";

let menu;

if (__BUILD_TARGET__ === "GUI") {
    menu = GuiMainMenu;
} else if (__BUILD_TARGET__ === "EXPLORER") {
    menu = ExplorerMainMenu;
} else if (__BUILD_TARGET__ === "OFFLINE") {
    menu = OfflineMainMenu;
} else {
    //console.error("MainMenu: Unknown build target");
    //throw new Error("Unknown build target");
}

export default menu;
