import axios from "axios";
import FormData from "form-data";
import fs from "fs"

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
        "pinata_api_key": "4c0d0b184b5d317ab298",
        "pinata_secret_api_key": "e907ea6eb56877bed806dc0f9bf3c88d5bad03bd8cd0c0d23cc1c5068ab52815",
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    });
    console.log(`${file},${response.data.IpfsHash}`);
    fs.appendFileSync("log.txt", `${file},${response.data.IpfsHash}\n`);

  } catch (e) {
    console.error(e);
  }

}
