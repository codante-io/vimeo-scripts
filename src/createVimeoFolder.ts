import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ======= CONSTs =======
// Altere aqui!
const VIMEO_TOKEN = process.env.VIMEO_TOKEN;
const VIMEO_PARENT_FOLDER_ID = process.env.VIMEO_PARENT_FOLDER_ID;
const VIMEO_FOLDER_NAME = "MP0040 - Pomodoro Timer";
// ======================

if (!VIMEO_TOKEN) throw new Error("VIMEO_TOKEN not found in .env file");

async function createNewVimeoFolder() {
  //get folder
  const parentUri = await axios
    .get(`https://api.vimeo.com/me/folders/${VIMEO_PARENT_FOLDER_ID}`, {
      headers: {
        Authorization: `Bearer ${VIMEO_TOKEN}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });

  return axios
    .post(
      `https://api.vimeo.com/me/projects`,
      {
        name: VIMEO_FOLDER_NAME,
        parent_folder_uri: parentUri?.data.uri,
      },
      {
        headers: {
          Authorization: `Bearer ${VIMEO_TOKEN}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

createNewVimeoFolder();
