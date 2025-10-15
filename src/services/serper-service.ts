'use server';

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SERPER_API_URL = 'https://google.serper.dev';

function checkApiKey() {
    if (!SERPER_API_KEY) {
        throw new Error(
            'A chave da API da Serper.dev (SERPER_API_KEY) não foi definida nas variáveis de ambiente.'
        );
    }
    return SERPER_API_KEY;
}

interface SearchPlacesParams {
    q: string;
    location?: string;
    gl?: string;
    hl?: string;
    limit?: number;
}

export async function searchPlaces(query: string, location?: string, limit: number = 20) {
    const apiKey = checkApiKey();
    console.log('Buscando no Serper.dev (Places):', { query, location });

    try {
        const response = await fetch(`${SERPER_API_URL}/places`, {
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: query,
                location: location,
                gl: 'br',
                hl: 'pt-br',
                limit: limit,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na API Serper.dev (Places):', response.status, errorData);
            throw new Error(`Erro na API Serper.dev (Places): ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        return data.places || [];
    } catch (error) {
        console.error('Erro ao chamar a API /places da Serper.dev:', error);
        throw error;
    }
}


export async function getPlaceDetails(placeId: string) {
    const apiKey = checkApiKey();
    console.log('Buscando detalhes do local no Serper.dev:', placeId);

    try {
        const response = await fetch(`${SERPER_API_URL}/places`, {
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: `placeId:${placeId}`, // Usando o placeId para buscar detalhes específicos
                gl: 'br',
                hl: 'pt-br',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na API Serper.dev (Place Details):', response.status, errorData);
            throw new Error(`Erro na API Serper.dev (Place Details): ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        // A Serper retorna um array de 'places', pegamos o primeiro resultado que deve ser o correto
        return (data.places && data.places.length > 0) ? data.places[0] : null;

    } catch (error) {
        console.error('Erro ao chamar a API /places para detalhes na Serper.dev:', error);
        throw error;
    }
}
