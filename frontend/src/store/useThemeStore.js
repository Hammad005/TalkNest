import {create} from 'zustand'
const useThemeStore = create((set) => ({
    theme: localStorage.getItem("TalkNest-Theme") || "forest",
    setTheme: (theme) => {
        localStorage.setItem("TalkNest-Theme", theme);
        set({ theme });
    },
}))

export default useThemeStore;