'use server';

/**
 * @fileOverview Um fluxo para buscar detalhes completos de um lead de negócio usando seu ID do Google Maps via Serper.dev.
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
      'O ID único do negócio (placeId da Serper) para o qual buscar detalhes.'
    ),
});
export type GetLeadDetailsInput = z.infer<typeof GetLeadDetailsInputSchema>;

const GetLeadDetailsOutputSchema = z.object({
  website: z.string().optional().describe('A URL do site do negócio.'),
  phone: z
    .string()
    .optional()
    .describe(
      'O número de telefone formatado do negócio (phoneNumber).'
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
    .array(z.any()).optional() // A estrutura pode variar, então usamos `any` por segurança
    .describe(
      'O horário de funcionamento do negócio.'
    ),
  googleMapsUrl: z
    .string()
    .optional()
    .describe('A URL do negócio no Google Maps (link).'),
  address: z.string().optional().describe('O endereço do negócio.'),
});
export type GetLeadDetailsOutput = z.infer<typeof GetLeadDetailsOutputSchema>;

export async function getLeadDetails(
  input: GetLeadDetailsInput
): Promise<GetLeadDetailsOutput> {
  console.log('Buscando detalhes para o businessId:', input.businessId);
  try {
    const result = await getLeadDetailsFlow(input);
    console.log('Detalhes encontrados com sucesso para:', input.businessId, result);
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

    const internationalPhone = details.phoneNumber?.replace(/\D/g, '');
    const whatsappLink = internationalPhone
      ? `https://wa.me/55${internationalPhone.replace(/^55/, '')}` // Garante o código do país
      : undefined;

    return {
      website: details.website,
      phone: details.phoneNumber,
      internationalPhone: internationalPhone,
      whatsappLink: whatsappLink,
      rating: details.rating,
      openingHours: details.openingHours,
      googleMapsUrl: details.link,
      address: details.address,
    };
  }
);
