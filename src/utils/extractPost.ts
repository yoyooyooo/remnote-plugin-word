export const extractPost = (url: string): Promise<string> => {
  return fetch(`https://r.jina.ai/${url}`).then((res) => res.text());
};
