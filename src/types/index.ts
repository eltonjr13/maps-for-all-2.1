export type Business = {
  id: string;
  name: string;
  address: string;
  category: string;
  website: string;
  phone: string;
  email: string;
  rating: number;
  openingHours: string;
  location: {
    lat: number;
    lng: number;
  };
};
