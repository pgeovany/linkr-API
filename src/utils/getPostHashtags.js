function getPostHashtags(content) {
  if (content) {
    const hashtags = content.match(/#+[a-zA-Z0-9(_)]{1,}/g);

    if (hashtags) {
      return hashtags.map((hashtag) => hashtag.slice(1));
    }
  }
  return false;
}

export default getPostHashtags;
