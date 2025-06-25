'use server';
/**
 * @fileOverview Um fluxo para buscar leads de negócios usando a API do Google Maps.
 *
 * - searchLeads - Uma função que encontra leads de negócios com base em critérios de busca.
 * - SearchLeadsInput - O tipo de entrada para a função searchLeads.
 * - SearchLeadsOutput - O tipo de retorno para a função searchLeads.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {searchPlacesByText} from '@/services/google-maps-service';

const BasicBusinessSchema = z.object({
  id: z.string().describe('Um identificador único para o negócio (place_id).'),
  name: z.string().describe('O nome do negócio.'),
  address: z
    .string()
    .describe('O endereço completo do negócio (formatted_address).'),
  category: z.string().describe('A categoria principal do negócio.'),
  location: z.object({
    lat: z.number().describe('A latitude da localização do negócio.'),
    lng: z.number().describe('A longitude da localização do negócio.'),
  }),
});

const SearchLeadsInputSchema = z.object({
  location: z
    .string()
    .describe('A localização central para a busca (ex: "São Paulo, SP").'),
  niche: z
    .string()
    .describe(
      'O nicho ou categoria de negócio a ser buscado (ex: "contabilidade").'
    ),
  radius: z.number().describe('O raio de busca em quilômetros.'),
});
export type SearchLeadsInput = z.infer<typeof SearchLeadsInputSchema>;

const SearchLeadsOutputSchema = z.object({
  businesses: z.array(BasicBusinessSchema),
});
export type SearchLeadsOutput = z.infer<typeof SearchLeadsOutputSchema>;

export async function searchLeads(
  input: SearchLeadsInput
): Promise<SearchLeadsOutput> {
  console.log(
    'Iniciando a função searchLeads com a entrada:',
    JSON.stringify(input)
  );
  try {
    const result = await searchLeadsFlow(input);
    console.log('Função searchLeads concluída com sucesso.');
    return result;
  } catch (error) {
    console.error('Erro detalhado na execução de searchLeads:', error);
    throw error;
  }
}

const searchLeadsFlow = ai.defineFlow(
  {
    name: 'searchLeadsFlow',
    inputSchema: SearchLeadsInputSchema,
    outputSchema: SearchLeadsOutputSchema,
  },
  async ({location, niche, radius}) => {
    console.log(
      'Dentro do searchLeadsFlow. Chamando o serviço do Google Maps...'
    );

    const query = `${niche} em ${location}`;
    const places = await searchPlacesByText(query, radius);

    console.log(`${places.length} locais encontrados pela API.`);

    const businesses = places
      .map(place => {
        if (!place.place_id || !place.name || !place.geometry?.location) {
          return null;
        }
        return {
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || 'Endereço não disponível',
          category:
            place.types
              ?.find(t => t !== 'point_of_interest' && t !== 'establishment')
              ?.replace(/_/g, ' ') || 'Não categorizado',
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
        };
      })
      .filter((b): b is z.infer<typeof BasicBusinessSchema> => b !== null);

    console.log(`${businesses.length} empresas mapeadas com sucesso.`);
    return {businesses};
  }
);
