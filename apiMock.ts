import axios, { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

type User = {
  username: string;
  password: string;
  id: number;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const amenitiesList = ['Wi-Fi', 'Parking', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Room Service'];

type Hotel = {
  id: number;
  name: string;
  rating: number;
  images: string[];
  price: number;
  location: string;
  amenities: string[];
};

const generateHotel = (id: number): Hotel => {
  const locations = ['New York, USA', 'Paris, France', 'Tokyo, Japan', 'London, UK', 'Sydney, Australia'];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];

  const images = Array.from({ length: 3 }, (_, index) => `https://picsum.photos/200/300?random=${id}${index}`);

  const numAmenities = Math.floor(Math.random() * (amenitiesList.length + 1));
  const randomAmenities = new Set<string>();
  while (randomAmenities.size < numAmenities) {
    const randomIndex = Math.floor(Math.random() * amenitiesList.length);
    randomAmenities.add(amenitiesList[randomIndex]);
  }
  const amenities = Array.from(randomAmenities);

  return {
    id,
    name: `Hotel ${id}`,
    rating: Math.floor(Math.random() * 5) + 1,
    images,
    price: Math.floor(Math.random() * 500) + 50,
    location: randomLocation,
    amenities,
  };
};

const mockHotels = Array.from({ length: 100 }, (_, index) => generateHotel(index + 1));

const users: User[] = [
  { username: 'admin', password: 'password', id: 1 },
];

mock.onGet('/hotels').reply(200, { hotels: mockHotels });

mock.onPost('/login').reply<AxiosRequestConfig>(config => {
  const { username, password } = JSON.parse(config.data as string);
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    const accessToken = generateRandomToken();
    const refreshToken = generateRandomToken();
    const tokens: Tokens = { accessToken, refreshToken };
    return [200, tokens];
  } else {
    return [401, { error: 'Invalid credentials' }];
  }
});

const generateRandomToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default mock;
