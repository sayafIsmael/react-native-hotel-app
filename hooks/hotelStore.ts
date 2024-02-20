import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Hotel = {
  id: number;
  name: string;
  price: string;
  location: string;
  rating: number;
  images: string[];
  amenities: string[];
};

type HotelState = {
  hotels: Hotel[];
  totalPages: number;
  addHotels: (hotels: Hotel[]) => void;
};

export const useHotelStore = create<HotelState>((set) => ({
  hotels: [],
  totalPages: 1,
  addHotels: async (hotels) => {
    try {
      const totalPages = Math.ceil((hotels.length + useHotelStore.getState().hotels.length) / 10); 
      await AsyncStorage.setItem('hotels', JSON.stringify(hotels));
      set({ hotels, totalPages });
    } catch (error) {
      console.error('Error adding hotels:', error);
    }
  },
}));

(async () => {
  try {
    const hotelsJSON = await AsyncStorage.getItem('hotels');
    if (hotelsJSON) {
      const hotels = JSON.parse(hotelsJSON);
      const totalPages = Math.ceil(hotels.length / 10); 
      useHotelStore.setState({ hotels, totalPages });
    }
  } catch (error) {
    console.error('Error loading hotels:', error);
  }
})();
