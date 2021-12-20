import axios from "axios";
import cheerio from "cheerio";
import { OgpData } from "types/ogpData";

export const GetOgp = async (url: string) => {
  const info: OgpData = {
    url,
    title: null,
    description: null,
    image: null,
  };

  const res = await axios
    .get(encodeURI(url))
    .then((response) => response)
    .catch(() => null);
  if (res === null) return info;

  const html = res.data;
  const $ = cheerio.load(html);

  const title = $("title").text();
  const description = $('meta[property="og:description"]').attr("content");
  const image = $('meta[property="og:image"]').attr("content");

  info.title = title === undefined ? null : title;
  info.description = description === undefined ? null : description;
  info.image = image === undefined ? null : image;

  return info;
};

export const DisplayOgp = (url: string, title: string, description: string, isImage: boolean, image: string) => {
  if (title === "") return "";

  const domains = url.match(/([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/g);
  let domain: string;

  if (domains === null) domain = "";
  else if (domains.length === 0) domain = "";
  else domain = domains[0].toString();

  description.replace(/\r?\n/g, "");

  if (isImage)
    return `
  <a href="${url}">
    <div class="w-full my-2 flex border-solid border-2">
      <div class="w-4/6 sm:w-5/6 p-2">
        <p class="w-full sm:text-lg font-medium text-black truncate" style="margin: unset">${title}</p>
        <p class="w-full font-light text-black truncate" style="margin: unset">${description}</p>
        <p class="w-full text-sm font-light text-black truncate" style="margin: unset">${domain}</p>
      </div>
      <img class="h-full w-2/6 sm:w-1/6 my-auto" style="display: ${isImage}" src="${image}" alt=""/>
    </div>
  </a>`;

  return `
  <a href="${url}">
    <div class="w-full p-2 my-2 border-solid border-2">
      <p class="w-full sm:text-lg font-medium text-black truncate" style="margin: unset">${title}</p>
      <p class="w-full font-light text-black truncate" style="margin: unset">${description}</p>
      <p class="w-full text-sm font-light text-black truncate" style="margin: unset">${domain}</p>
    </div>
  </a>`;
};
