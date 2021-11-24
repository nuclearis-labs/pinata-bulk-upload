import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const folder = fs.readdirSync("./PDFS");

for (const file of folder) {

  const data = new FormData();
  data.append('file', fs.createReadStream(`./PDFS/${file}`));

  try {
    const response = await axios({
      url: "/pinning/pinFileToIPFS",
      method: 'post',
      data,
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      baseURL: 'https://api.pinata.cloud/',
      headers: {
        "pinata_api_key": process.env.PINATA_API_KEY,
        "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    });
    console.log(`${file},${response.data.IpfsHash}`);
    fs.appendFileSync("log.txt", `${file},${response.data.IpfsHash}\n`);

  } catch (e) {
    console.error(e);
  }

}
