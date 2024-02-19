import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const amenitiesList = ['Wi-Fi', 'Parking', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', 'Room Service'];

const generateHotel = (id: number) => {
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

mock.onPost('/login').reply(200, { token: 'sample_token' });
mock.onGet('/hotels').reply(200, { hotels: mockHotels });

export default mock;
