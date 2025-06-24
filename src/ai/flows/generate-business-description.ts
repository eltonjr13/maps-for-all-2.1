'use server';

/**
 * @fileOverview Este arquivo define um fluxo Genkit para gerar uma descrição de negócio curta e atraente para um determinado lead.
 *
 * - generateBusinessDescription - Uma função que gera uma descrição de negócio.
 * - GenerateBusinessDescriptionInput - O tipo de entrada para a função generateBusinessDescription.
 * - GenerateBusinessDescriptionOutput - O tipo de retorno para a função generateBusinessDescription.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessDescriptionInputSchema = z.object({
  category: z.string().describe('A categoria do negócio.'),
  location: z.string().describe('A localização do negócio.'),
});
export type GenerateBusinessDescriptionInput = z.infer<
  typeof GenerateBusinessDescriptionInputSchema
>;

const GenerateBusinessDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('Uma descrição curta e atraente do negócio.'),
});
export type GenerateBusinessDescriptionOutput = z.infer<
  typeof GenerateBusinessDescriptionOutputSchema
>;

export async function generateBusinessDescription(
  input: GenerateBusinessDescriptionInput
): Promise<GenerateBusinessDescriptionOutput> {
  return generateBusinessDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessDescriptionPrompt',
  input: {schema: GenerateBusinessDescriptionInputSchema},
  output: {schema: GenerateBusinessDescriptionOutputSchema},
  prompt: `Você é um redator de marketing especialista em gerar descrições de negócios concisas e envolventes.

  Com base na categoria e localização de um negócio, gere uma descrição curta e atraente que capture a essência de suas ofertas.

  Categoria: {{{category}}}
  Localização: {{{location}}}

  Descrição:`,
});

const generateBusinessDescriptionFlow = ai.defineFlow(
  {
    name: 'generateBusinessDescriptionFlow',
    inputSchema: GenerateBusinessDescriptionInputSchema,
    outputSchema: GenerateBusinessDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
