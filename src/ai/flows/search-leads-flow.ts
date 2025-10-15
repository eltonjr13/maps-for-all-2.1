'use server';
/**
 * @fileOverview Um fluxo para buscar leads de negócios usando a API do Serper.dev.
 *
 * - searchLeads - Uma função que encontra leads de negócios com base em critérios de busca.
 * - SearchLeadsInput - O tipo de entrada para a função searchLeads.
 * - SearchLeadsOutput - O tipo de retorno para a função searchLeads.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { searchPlaces } from '@/services/serper-service';

const BasicBusinessSchema = z.object({
  id: z.string().describe('Um identificador único para o negócio (placeId).'),
  name: z.string().describe('O nome do negócio.'),
  address: z
    .string()
    .describe('O endereço completo do negócio (address).'),
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
  async ({location, niche}) => {
    console.log(
      'Dentro do searchLeadsFlow. Chamando o serviço do Serper.dev...'
    );

    const query = `${niche} em ${location}`;
    const places = await searchPlaces(query);

    console.log(`${places.length} locais encontrados pela API Serper.dev.`);

    const businesses = places
      .map(place => {
        if (!place.placeId || !place.title || !place.gpsCoordinates) {
          return null;
        }
        return {
          id: place.placeId,
          name: place.title,
          address: place.address || 'Endereço não disponível',
          category: place.category || 'Não categorizado',
          location: {
            lat: place.gpsCoordinates.latitude,
            lng: place.gpsCoordinates.longitude,
          },
        };
      })
      .filter((b): b is z.infer<typeof BasicBusinessSchema> => b !== null);

    console.log(`${businesses.length} empresas mapeadas com sucesso.`);
    return {businesses};
  }
);
