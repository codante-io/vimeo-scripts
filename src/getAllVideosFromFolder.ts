import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ======= CONSTs =======
// Altere aqui!
const VIMEO_TOKEN = process.env.VIMEO_TOKEN;
const VIMEO_FOLDER_ID = process.env.VIMEO_FOLDER_ID;
// ======================

if(!VIMEO_TOKEN) throw new Error('VIMEO_TOKEN not found in .env file');
if(!VIMEO_FOLDER_ID) throw new Error('VIMEO_FOLDER_ID not found in .env file');

getAllVideosFromFolder(VIMEO_FOLDER_ID);


function getAllVideosFromFolder(folderId: string | number) {
  axios
    .get(`https://api.vimeo.com/me/projects/${folderId}/videos?per_page=100`, {
      headers: {
        Authorization: `Bearer ${VIMEO_TOKEN}`,
      },
    })
    .then((response) => {
      response.data.data.forEach((video: any) => {
        console.log(
          '"' +
            video.name +
            ',' +
            video.link.replace('https://vimeo.com/', '') +
            ',' +
            video.duration +
            '"'
        );
      });
      // console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
