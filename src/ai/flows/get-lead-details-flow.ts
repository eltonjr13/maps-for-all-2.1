'use server';

/**
 * @fileOverview Um fluxo para buscar detalhes completos de um lead de negócio usando seu ID.
 *
 * - getLeadDetails - Uma função que busca os detalhes de um negócio.
 * - GetLeadDetailsInput - O tipo de entrada para a função getLeadDetails.
 * - GetLeadDetailsOutput - O tipo de retorno para a função getLeadDetails.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLeadDetailsInputSchema = z.object({
  businessId: z
    .string()
    .describe(
      'O ID único do negócio (place_id) para o qual buscar detalhes.'
    ),
});
export type GetLeadDetailsInput = z.infer<typeof GetLeadDetailsInputSchema>;

const GetLeadDetailsOutputSchema = z.object({
  website: z.string().optional().describe('A URL do site do negócio.'),
  phone: z
    .string()
    .optional()
    .describe(
      'O número de telefone formatado do negócio (formatted_phone_number).'
    ),
  internationalPhone: z
    .string()
    .optional()
    .describe(
      'O número de telefone internacional no formato E.164 (ex: 5511912345678).'
    ),
  whatsappLink: z
    .string()
    .optional()
    .describe(
      'O link do WhatsApp no formato https://wa.me/TELEFONE_E164. Deve ser gerado a partir do internationalPhone, se ele existir.'
    ),
  email: z.string().optional().describe('O endereço de e-mail do negócio.'),
  rating: z
    .number()
    .min(1)
    .max(5)
    .optional()
    .describe('A avaliação do negócio, de 1 a 5.'),
  openingHours: z
    .string()
    .optional()
    .describe('O horário de funcionamento do negócio (ex: "Aberto agora", "Fechado").'),
});
export type GetLeadDetailsOutput = z.infer<typeof GetLeadDetailsOutputSchema>;

export async function getLeadDetails(
  input: GetLeadDetailsInput
): Promise<GetLeadDetailsOutput> {
  console.log('Buscando detalhes para o businessId:', input.businessId);
  try {
    const result = await getLeadDetailsFlow(input);
    console.log('Detalhes encontrados com sucesso para:', input.businessId);
    return result;
  } catch (error) {
    console.error('Erro ao buscar detalhes para o lead:', error);
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'getLeadDetailsPrompt',
  input: {schema: GetLeadDetailsInputSchema},
  output: {schema: GetLeadDetailsOutputSchema},
  prompt: `Você é um assistente que funciona como a API do Google Maps Places Details.
    
    Dado um ID de negócio (place_id), gere os detalhes de contato completos para essa empresa.
    
    Os detalhes devem incluir: site, telefone formatado (phone), telefone internacional E.164 (internationalPhone), e-mail, avaliação e horário de funcionamento, conforme especificado no esquema de saída.
    
    Se um 'internationalPhone' for gerado, crie também um 'whatsappLink' correspondente no formato 'https://wa.me/NUMERO_E164' (onde NUMERO_E164 é o internationalPhone sem símbolos como '+').
    
    Garanta que os dados gerados sejam realistas e plausíveis para uma empresa real. Nem todas as empresas terão todos os campos preenchidos.
    
    ID do Negócio: {{{businessId}}}
    `,
});

const getLeadDetailsFlow = ai.defineFlow(
  {
    name: 'getLeadDetailsFlow',
    inputSchema: GetLeadDetailsInputSchema,
    outputSchema: GetLeadDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error(
        'A resposta da IA para os detalhes do lead estava vazia.'
      );
    }
    return output;
  }
);
