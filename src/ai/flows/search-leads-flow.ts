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

const BasicBusinessSchema = z.object({
  id: z.string().describe('Um identificador único para o negócio (place_id).'),
  name: z.string().describe('O nome do negócio.'),
  address: z.string().describe('O endereço completo do negócio (formatted_address).'),
  category: z.string().describe('A categoria do negócio (types).'),
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
  businesses: z.array(BasicBusinessSchema),
});
export type SearchLeadsOutput = z.infer<typeof SearchLeadsOutputSchema>;

export async function searchLeads(input: SearchLeadsInput): Promise<SearchLeadsOutput> {
  console.log('Iniciando a função searchLeads com a entrada:', JSON.stringify(input));
  try {
    const result = await searchLeadsFlow(input);
    console.log('Função searchLeads concluída com sucesso.');
    return result;
  } catch (error) {
    console.error('Erro detalhado na execução de searchLeads:', error);
    throw error; // Re-throw the error after logging
  }
}

const prompt = ai.definePrompt({
  name: 'searchLeadsPrompt',
  input: {schema: SearchLeadsInputSchema},
  output: {schema: SearchLeadsOutputSchema},
  prompt: `Você é um assistente de diretório de negócios que funciona como a API do Google Maps Places (nearbySearch).
  
  Com base na localização, nicho de negócio e raio de busca fornecidos, gere uma lista realista de 10 a 16 empresas que correspondam aos critérios.
  
  Para cada empresa, forneça APENAS os seguintes detalhes básicos: id (um place_id único), nome, endereço (formatted_address), categoria (types) e localização (latitude e longitude).
  Não inclua nenhuma outra informação como telefone, site, avaliação, etc.

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
    console.log('Dentro do searchLeadsFlow. Chamando o prompt de IA...');
    const {output} = await prompt(input);
    console.log(`Prompt de IA retornou. ${output?.businesses?.length || 0} empresas encontradas.`);
    if (!output) {
      console.error('A saída do prompt de IA foi nula ou indefinida.');
      throw new Error('A resposta da IA estava vazia.');
    }
    return output;
  }
);
