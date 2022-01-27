import * as prismic from '@prismicio/client';


export function getPrismicClient() {
  const client = prismic.createClient(process.env.PRISMIC_API_ENDPOINT);

  return client;
}
