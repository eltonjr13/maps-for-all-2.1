'use server';
/**
 * @fileOverview A flow to search for business leads, simulating a Google Maps API call.
 *
 * - searchLeads - A function that finds business leads based on search criteria.
 * - SearchLeadsInput - The input type for the searchLeads function.
 * - SearchLeadsOutput - The return type for the searchLeads function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessSchema = z.object({
  id: z.string().describe('A unique identifier for the business.'),
  name: z.string().describe('The name of the business.'),
  address: z.string().describe('The full address of the business.'),
  category: z.string().describe('The category of the business.'),
  website: z.string().url().describe('The business website URL.'),
  phone: z.string().describe('The business phone number.'),
  email: z.string().email().describe('The business email address.'),
  rating: z.number().min(1).max(5).describe('The business rating, from 1 to 5.'),
  openingHours: z.string().describe('The business opening hours (e.g., "Open now", "Closed").'),
  location: z.object({
    lat: z.number().describe('The latitude of the business location.'),
    lng: z.number().describe('The longitude of the business location.'),
  }),
});

const SearchLeadsInputSchema = z.object({
  location: z.string().describe('The central location for the search (e.g., "New York, NY").'),
  niche: z.string().describe('The business niche or category to search for (e.g., "accounting").'),
  radius: z.number().describe('The search radius in kilometers.'),
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
  prompt: `You are a business directory assistant that functions like the Google Maps Places API.
  
  Based on the provided location, business niche, and search radius, generate a realistic list of 5 to 10 businesses that match the criteria. 
  
  For each business, provide all the necessary details as specified in the output schema: id, name, address, category, website, phone, email, rating, openingHours, and geographic location (latitude and longitude).
  
  Ensure the generated data is realistic and relevant to the search query. The addresses and locations should be plausible for the given search location.

  Search Criteria:
  - Location: {{{location}}}
  - Niche: {{{niche}}}
  - Radius: {{{radius}}} km
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
