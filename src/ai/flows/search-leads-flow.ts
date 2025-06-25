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
  address: z.string().describe('O endereço completo do negócio (formatted_address).'),
  category: z.string().describe('A categoria do negócio (types).'),
  website: z.string().optional().describe('A URL do site do negócio.'),
  phone: z.string().optional().describe('O número de telefone formatado do negócio (formatted_phone_number).'),
  internationalPhone: z.string().optional().describe('O número de telefone internacional no formato E.164 (ex: 5511912345678).'),
  whatsappLink: z.string().optional().describe('O link do WhatsApp no formato https://wa.me/TELEFONE_E164. Deve ser gerado a partir do internationalPhone, se ele existir.'),
  email: z.string().optional().describe('O endereço de e-mail do negócio.'),
  rating: z.number().min(1).max(5).optional().describe('A avaliação do negócio, de 1 a 5.'),
  openingHours: z.string().optional().describe('O horário de funcionamento do negócio (ex: "Aberto agora", "Fechado").'),
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
  prompt: `Você é um assistente de diretório de negócios que funciona como a API do Google Maps Places.
  
  Com base na localização, nicho de negócio e raio de busca fornecidos, gere uma lista realista de 10 a 16 empresas que correspondam aos critérios.
  
  Para cada empresa, forneça todos os detalhes necessários conforme especificado no esquema de saída: id, nome, endereço, categoria, site, telefone formatado (phone), telefone internacional E.164 (internationalPhone), e-mail, avaliação, horário de funcionamento e localização.
  
  Se um 'internationalPhone' for gerado, crie também um 'whatsappLink' correspondente no formato 'https://wa.me/NUMERO_E164' (onde NUMERO_E164 é o internationalPhone sem símbolos como '+').
  
  Garanta que os dados gerados sejam realistas e relevantes para a consulta de busca. Os endereços e localizações devem ser plausíveis para a localização de busca informada. Nem todas as empresas terão todos os campos preenchidos.

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
