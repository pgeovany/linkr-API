import urlMetadata from 'url-metadata';

async function getUrlMetadata(url) {
  const metadata = await urlMetadata(url);

  return {
    urlTitle: metadata.title,
    urlImage: metadata.image,
    urlDescription: metadata.description,
  };
}

export default getUrlMetadata;
