'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a short, compelling business description for a given lead.
 *
 * - generateBusinessDescription - A function that generates a business description.
 * - GenerateBusinessDescriptionInput - The input type for the generateBusinessDescription function.
 * - GenerateBusinessDescriptionOutput - The return type for the generateBusinessDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessDescriptionInputSchema = z.object({
  category: z.string().describe('The category of the business.'),
  location: z.string().describe('The location of the business.'),
});
export type GenerateBusinessDescriptionInput = z.infer<
  typeof GenerateBusinessDescriptionInputSchema
>;

const GenerateBusinessDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A short, compelling description of the business.'),
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
  prompt: `You are an expert marketing copywriter specializing in generating concise and engaging business descriptions.

  Based on the category and location of a business, generate a short, compelling description that captures the essence of its offerings.

  Category: {{{category}}}
  Location: {{{location}}}

  Description:`,
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
