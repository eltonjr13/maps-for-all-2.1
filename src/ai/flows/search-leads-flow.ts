'use server';
/**
 * @fileOverview Um fluxo para buscar leads de negócios, simulando uma chamada à API do Google Maps.
 *
 * - searchLeads - Uma função que encontra leads de negócios com base em critérios de busca.
 * - SearchLeadsInput - O tipo de entrada para a função searchLeads.
 * - SearchLeadsOutput - O tipo de retorno para a função searchLeads.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessSchema = z.object({
  id: z.string().describe('Um identificador único para o negócio.'),
  name: z.string().describe('O nome do negócio.'),
  address: z.string().describe('O endereço completo do negócio.'),
  category: z.string().describe('A categoria do negócio.'),
  website: z.string().describe('A URL do site do negócio.'),
  phone: z.string().describe('O número de telefone do negócio.'),
  email: z.string().describe('O endereço de e-mail do negócio.'),
  rating: z.number().min(1).max(5).describe('A avaliação do negócio, de 1 a 5.'),
  openingHours: z.string().describe('O horário de funcionamento do negócio (ex: "Aberto agora", "Fechado").'),
  location: z.object({
    lat: z.number().describe('A latitude da localização do negócio.'),
    lng: z.number().describe('A longitude da localização do negócio.'),
  }),
});

const SearchLeadsInputSchema = z.object({
  location: z.string().describe('A localização central para a busca (ex: "São Paulo, SP").'),
  niche: z.string().describe('O nicho ou categoria de negócio a ser buscado (ex: "contabilidade").'),
  radius: z.number().describe('O raio de busca em quilômetros.'),
});
export type SearchLeadsInput = z.infer<typeof SearchLeadsInputSchema>;

const SearchLeadsOutputSchema = z.object({
  businesses: z.array(BusinessSchema),
});
export type SearchLeadsOutput = z.infer<typeof SearchLeadsOutputSchema>;

export async function searchLeads(input: SearchLeadsInput): Promise<SearchLeadsOutput> {
  return searchLeadsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchLeadsPrompt',
  input: {schema: SearchLeadsInputSchema},
  output: {schema: SearchLeadsOutputSchema},
  prompt: `Você é um assistente de diretório de negócios que funciona como a API do Google Maps Places.
  
  Com base na localização, nicho de negócio e raio de busca fornecidos, gere uma lista realista de 5 a 10 empresas que correspondam aos critérios.
  
  Para cada empresa, forneça todos os detalhes necessários conforme especificado no esquema de saída: id, nome, endereço, categoria, site, telefone, e-mail, avaliação, horário de funcionamento e localização geográfica (latitude e longitude).
  
  Garanta que os dados gerados sejam realistas e relevantes para a consulta de busca. Os endereços e localizações devem ser plausíveis para a localização de busca informada.

  Critérios de Busca:
  - Localização: {{{location}}}
  - Nicho: {{{niche}}}
  - Raio: {{{radius}}} km
  `,
});

const searchLeadsFlow = ai.defineFlow(
  {
    name: 'searchLeadsFlow',
    inputSchema: SearchLeadsInputSchema,
    outputSchema: SearchLeadsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
