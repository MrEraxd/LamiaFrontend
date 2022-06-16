import { defineStore } from 'pinia';

export const useControlPanelStore = defineStore('ControlPanelStore', {
  state: () => {
    return {
      latitude: parseFloat(
        import.meta.env.VITE_CONTROL_PANEL_DEFAULT_LAT as string
      ),
      longitude: parseFloat(
        import.meta.env.VITE_CONTROL_PANEL_DEFAULT_LNG as string
      ),
      name: import.meta.env.VITE_CONTROL_PANEL_DEFAULT_NAME as string,
      vicinity: import.meta.env.VITE_CONTROL_PANEL_DEFAULT_ADDRESS as string,
    };
  },
  actions: {
    setCurrentLatitude(newLatitude: string) {
      this.latitude = parseFloat(newLatitude);
    },
    setCurrentLongitude(newLongitude: string) {
      this.longitude = parseFloat(newLongitude);
    },
    setCurrentName(newName: string) {
      this.name = newName;
    },
    setCurrentVicinity(newVicinity: string) {
      this.vicinity = newVicinity;
    },
  },
});
