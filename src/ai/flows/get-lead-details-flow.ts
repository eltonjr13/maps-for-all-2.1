'use server';

/**
 * @fileOverview Um fluxo para buscar detalhes completos de um lead de negócio usando seu ID do Google Maps.
 *
 * - getLeadDetails - Uma função que busca os detalhes de um negócio.
 * - GetLeadDetailsInput - O tipo de entrada para a função getLeadDetails.
 * - GetLeadDetailsOutput - O tipo de retorno para a função getLeadDetails.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getPlaceDetails as getPlaceDetailsFromSerper } from '@/services/serper-service';

const GetLeadDetailsInputSchema = z.object({
  businessId: z
    .string()
    .describe(
      'O ID único do negócio (placeId) para o qual buscar detalhes.'
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
  rating: z.number().optional().describe('A avaliação do negócio, de 1 a 5.'),
  openingHours: z
    .string()
    .optional()
    .describe(
      'O horário de funcionamento do negócio (ex: "Aberto agora", "Fechado").'
    ),
  googleMapsUrl: z
    .string()
    .optional()
    .describe('A URL do negócio no Google Maps.'),
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

const getLeadDetailsFlow = ai.defineFlow(
  {
    name: 'getLeadDetailsFlow',
    inputSchema: GetLeadDetailsInputSchema,
    outputSchema: GetLeadDetailsOutputSchema,
  },
  async ({businessId}) => {
    const details = await getPlaceDetailsFromSerper(businessId);
    if (!details) {
      throw new Error('Não foi possível obter detalhes para o lead.');
    }

    const cleanedInternationalPhone = details.phoneNumber?.replace(
      /\D/g,
      ''
    );
    const whatsappLink = cleanedInternationalPhone
      ? `https://wa.me/${cleanedInternationalPhone}`
      : undefined;

    let openingHoursText = 'Não disponível';
    if (details.openingHours) {
        // Esta é uma suposição, a API da Serper pode ter um formato diferente
        // para 'openingHours'. Ajuste conforme necessário.
        const isOpen = details.openingHours.some((h: any) => h.isOpen === true);
        openingHoursText = isOpen ? 'Aberto agora' : 'Fechado';
    }


    return {
      website: details.website,
      phone: details.phoneNumber,
      internationalPhone: details.phoneNumber, // Serper.dev pode não fornecer um formato internacional separado
      whatsappLink: whatsappLink,
      rating: details.rating,
      openingHours: openingHoursText,
      googleMapsUrl: details.link,
    };
  }
);
