import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Altere aqui!
// ======= CONSTs =======
const VIMEO_TOKEN = process.env.VIMEO_TOKEN;
const VIMEO_FOLDER_ID = 16568487;
const VIMEO_PRESET_ID_CODANTE = 121111854;

// Descomente aqui!
addPresetToVideosInFolder(VIMEO_FOLDER_ID);
// ======= =======

// Esta função adiciona o preset de codante a todos os vídeos de uma pasta. 
// É necessário passar o 
async function addPresetToVideosInFolder(folderId: number) {
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
    return video.uri.replace('/videos/', '');
  });

  const promises = videoArray.map((videoId: any) => {
    return axios.put(
      `https://api.vimeo.com/videos/${videoId}/presets/${VIMEO_PRESET_ID_CODANTE}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${VIMEO_TOKEN}`,
        },
      }
    );
  });

  await Promise.all(promises);

  console.log('All videos have been updated with the preset');
}
