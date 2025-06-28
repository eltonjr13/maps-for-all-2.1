'use server';

import {Client} from '@googlemaps/google-maps-services-js';
import type {
  Place,
  PlaceDetailsResponseData,
  TextSearchResponseData,
} from '@googlemaps/google-maps-services-js';

const client = new Client({});

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function checkApiKey() {
  if (!API_KEY) {
    throw new Error(
      'A chave da API do Google Maps (GOOGLE_MAPS_API_KEY) não foi definida nas variáveis de ambiente.'
    );
  }
  return API_KEY;
}

export async function searchPlacesByText(
  query: string,
  radius: number
): Promise<TextSearchResponseData['results']> {
  const apiKey = checkApiKey();
  console.log('Buscando no Google Maps (TextSearch):', {query});
  try {
    const response = await client.textSearch({
      params: {
        query: query,
        key: apiKey,
        language: 'pt-BR',
      },
    });

    if (
      response.data.status === 'OK' ||
      response.data.status === 'ZERO_RESULTS'
    ) {
      return response.data.results.slice(0, 16); // Limita os resultados para otimização
    } else {
      console.error(
        'Erro na API Google Maps (TextSearch):',
        response.data.status,
        response.data.error_message
      );
      throw new Error(
        `Erro na API Google Maps (TextSearch): ${response.data.status}`
      );
    }
  } catch (error) {
    console.error('Erro ao chamar a API textSearch:', error);
    throw error;
  }
}

export async function getPlaceDetails(
  placeId: string
): Promise<PlaceDetailsResponseData['result']> {
  const apiKey = checkApiKey();
  console.log('Buscando detalhes do local no Google Maps:', placeId);
  const fields: (keyof Place)[] = [
    'place_id',
    'name',
    'formatted_address',
    'types',
    'website',
    'formatted_phone_number',
    'international_phone_number',
    'rating',
    'opening_hours',
    'geometry',
    'url',
  ];

  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: fields,
        key: apiKey,
        language: 'pt-BR',
      },
    });

    if (response.data.status === 'OK') {
      return response.data.result;
    } else {
      console.error(
        'Erro na API Google Maps (PlaceDetails):',
        response.data.status,
        response.data.error_message
      );
      throw new Error(
        `Erro na API Google Maps (PlaceDetails): ${response.data.status}`
      );
    }
  } catch (error) {
    console.error('Erro ao chamar a API placeDetails:', error);
    throw error;
  }
}
