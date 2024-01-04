import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Altere aqui!
// ======= CONSTs =======
const VIMEO_TOKEN = process.env.VIMEO_TOKEN;
const VIMEO_FOLDER_ID = process.env.VIMEO_FOLDER_ID;
const VIMEO_PRESET_ID_CODANTE = 121111854;

// ======================

if (!VIMEO_TOKEN) throw new Error("VIMEO_TOKEN not found in .env file");
if (!VIMEO_FOLDER_ID) throw new Error("VIMEO_FOLDER_ID not found in .env file");

// Descomente aqui!
addPresetToVideosInFolder(VIMEO_FOLDER_ID);
// ======= =======

// Esta função adiciona o preset de codante a todos os vídeos de uma pasta.
// É necessário passar o
async function addPresetToVideosInFolder(folderId: number | string) {
  const response = await axios.get(
    `https://api.vimeo.com/me/projects/${folderId}/videos?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${VIMEO_TOKEN}`,
      },
    }
  );
  const data = response.data.data;

  const videoArray = data.map((video: any) => {
    return video.uri.replace("/videos/", "");
  });

  await Promise.all(
    videoArray.map((videoId: any) => {
      return axios.put(
        `https://api.vimeo.com/videos/${videoId}/presets/${VIMEO_PRESET_ID_CODANTE}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${VIMEO_TOKEN}`,
          },
        }
      );
    })
  );

  await Promise.all(
    videoArray.map((videoId: string) => setVideoPrivacyAndWhitelist(videoId))
  );

  console.log("All videos have been updated with the preset");
}

async function setVideoPrivacyAndWhitelist(
  videoId: string,
  domain = "codante.io"
) {
  try {
    // Update video privacy settings
    await axios.patch(
      `https://api.vimeo.com/videos/${videoId}`,
      {
        privacy: {
          view: "hidden",
          embed: "whitelist",
        },
      },
      {
        headers: {
          Authorization: `bearer ${VIMEO_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Add domain to video's whitelist
    await axios.put(
      `https://api.vimeo.com/videos/${videoId}/privacy/domains/${domain}`,
      {},
      {
        headers: {
          Authorization: `bearer ${VIMEO_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Video ${videoId} updated to play on ${domain}`);
  } catch (error) {
    console.error(error);
  }
}
