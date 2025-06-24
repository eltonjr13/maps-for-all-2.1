'use server';

/**
 * @fileOverview Extrai informações de contato (telefone, e-mail) do site de uma empresa usando IA.
 *
 * - extractContactInfo - Uma função que lida com o processo de extração de informações de contato.
 * - ExtractContactInfoInput - O tipo de entrada para a função extractContactInfo.
 * - ExtractContactInfoOutput - O tipo de retorno para a função extractContactInfo.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractContactInfoInputSchema = z.object({
  websiteUrl: z.string().describe('A URL do site da empresa.'),
});
export type ExtractContactInfoInput = z.infer<typeof ExtractContactInfoInputSchema>;

const ExtractContactInfoOutputSchema = z.object({
  phoneNumbers: z.array(z.string()).describe('Um array de números de telefone encontrados no site.'),
  emailAddresses: z.array(z.string()).describe('Um array de endereços de e-mail encontrados no site.'),
});
export type ExtractContactInfoOutput = z.infer<typeof ExtractContactInfoOutputSchema>;

export async function extractContactInfo(input: ExtractContactInfoInput): Promise<ExtractContactInfoOutput> {
  return extractContactInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContactInfoPrompt',
  input: {schema: ExtractContactInfoInputSchema},
  output: {schema: ExtractContactInfoOutputSchema},
  prompt: `Você é um assistente de IA encarregado de extrair informações de contato de um site de empresa.

  Dada a URL de um site de empresa, extraia todos os números de telefone e endereços de e-mail presentes no site.
  Retorne os números de telefone e endereços de e-mail como arrays.

  URL do Site: {{{websiteUrl}}}
  `,
});

const extractContactInfoFlow = ai.defineFlow(
  {
    name: 'extractContactInfoFlow',
    inputSchema: ExtractContactInfoInputSchema,
    outputSchema: ExtractContactInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
