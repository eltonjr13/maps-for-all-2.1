export type Business = {
  id: string;
  name: string;
  address?: string;
  category?: string;
  website?: string;
  phone?: string;
  email?: string; // Mantido para compatibilidade, mas Serper raramente retorna
  rating?: number;
  openingHours?: any[]; // Pode ser uma estrutura complexa
  location: {
    lat: number;
    lng: number;
  };
  internationalPhone?: string;
  whatsappLink?: string;
  googleMapsUrl?: string;
};
