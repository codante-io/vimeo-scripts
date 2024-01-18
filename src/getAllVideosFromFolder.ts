import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';
import slugify from 'slugify';

dotenv.config();

// ======= CONSTs =======
// Altere aqui!
const VIMEO_TOKEN = process.env.VIMEO_TOKEN;
const VIMEO_FOLDER_ID = process.env.VIMEO_FOLDER_ID;
const WORKSHOP_ID = 73;
// ======================

if (!VIMEO_TOKEN) throw new Error('VIMEO_TOKEN not found in .env file');
if (!VIMEO_FOLDER_ID) throw new Error('VIMEO_FOLDER_ID not found in .env file');
const results: any[] = [];

readCSV(() => getAllVideosFromFolder(VIMEO_FOLDER_ID));

function readCSV(callback: any) {
  fs.createReadStream('data/data.csv')
    // @ts-ignore-next-line
    .pipe(csv())
    // @ts-ignore-next-line
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      callback();
    });
}

function getAllVideosFromFolder(folderId: string | number) {
  axios
    .get(`https://api.vimeo.com/me/projects/${folderId}/videos?per_page=100`, {
      headers: {
        Authorization: `Bearer ${VIMEO_TOKEN}`,
      },
    })
    .then((response) => {
      response.data.data.forEach((video: any) => {
        if (!isNaN(video.name)) {
          let index = Number(video.name) - 1;
          results[index]['video_url'] = video.link.replace(
            'https://vimeo.com/',
            'https://player.vimeo.com/video/'
          );
          results[index]['duration_in_seconds'] = video.duration;
          results[index]['slug'] = slugify(results[index].name, {
            lower: true,
          });
        }
      });

      generateSQL();
    })
    .catch((error) => {
      console.log(error);
    });
}

function generateSQL() {
  results.map((result) => {
    const sql =
      `INSERT INTO "lessons" ("workshop_id", "name", "description", "video_url", "duration_in_seconds", "slug", "created_at", "updated_at") values (${WORKSHOP_ID}, '${result.name}', '${result.description}', '${result.video_url}', ${result.duration_in_seconds}, '${result.slug}', NOW(), NOW() );`.replaceAll(
        '"',
        '`'
      );
    console.log(sql);
  });
}
