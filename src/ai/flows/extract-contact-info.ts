// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Extracts contact information (phone number, email) from a company's website using AI.
 *
 * - extractContactInfo - A function that handles the contact info extraction process.
 * - ExtractContactInfoInput - The input type for the extractContactInfo function.
 * - ExtractContactInfoOutput - The return type for the extractContactInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractContactInfoInputSchema = z.object({
  websiteUrl: z.string().url().describe('The URL of the company website.'),
});
export type ExtractContactInfoInput = z.infer<typeof ExtractContactInfoInputSchema>;

const ExtractContactInfoOutputSchema = z.object({
  phoneNumbers: z.array(z.string()).describe('An array of phone numbers found on the website.'),
  emailAddresses: z.array(z.string()).describe('An array of email addresses found on the website.'),
});
export type ExtractContactInfoOutput = z.infer<typeof ExtractContactInfoOutputSchema>;

export async function extractContactInfo(input: ExtractContactInfoInput): Promise<ExtractContactInfoOutput> {
  return extractContactInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContactInfoPrompt',
  input: {schema: ExtractContactInfoInputSchema},
  output: {schema: ExtractContactInfoOutputSchema},
  prompt: `You are an AI assistant tasked with extracting contact information from a company website.

  Given the URL of a company website, extract all phone numbers and email addresses present on the site.
  Return the phone numbers and email addresses as arrays.

  Website URL: {{{websiteUrl}}}
  `, // Ensure triple braces for websiteUrl to prevent HTML escaping
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
