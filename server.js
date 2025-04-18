require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));

// Store up to 5 files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });


///--> first we can extract the text from the image using image preview API(dont have access yet)
///--> then we can use the text to generate the image using DALL-E 3
///--> this will insure that the image is generated with the same text as the image


// async function describeImage(imagePath) {
//   const imageBuffer = fs.readFileSync(imagePath);
//   const base64 = imageBuffer.toString("base64");

//   const response = await openai.chat.completions.create({
//     model: "gpt-4-vision-preview",   
//     messages: [
//       { role: "system", content: "You are a fashion stylist assistant." },
//       {
//         role: "user",
//         content: [
//           { type: "text", text: "Describe the outfit in this image, including cut, color, fabric, and style details." },
//           { type: "image", image: { base64 } }
//         ]
//       }
//     ],
//     max_tokens: 300
//   });
//   return response.choices[0].message.content.trim();
// }
// (async () => {
//   try {
//     const desc = await describeImage("./uploads/my-outfit.png");
//     console.log("AI says:", desc);
//   } catch (e) {
//     console.error("Error calling vision API:", e);
//   }
// })();


app.post("/process", upload.array("images", 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  const styles = ["Office", "Party", "Vacation"];
  const results = [];

  try {
    for (const file of req.files) {
      const originalUrl = `/uploads/${file.filename}`;
      const row = { original: originalUrl };

      for (const style of styles) {
        const prompt = `Generate a high-resolution fashion image styled on an invisible mannequin with a clean, light-colored background. The image should feature the uploaded outfit as the centerpiece, styled specifically for a ${style} context. Maintain the original outfit's shape, layout, and proportions.

Add appropriate accessories, footwear, and styling details to make the look suitable for a ${style} setting.
Ensure consistency in lighting, background, mannequin styling, and overall composition. Use a studio-quality, editorial fashion photography aesthetic.
`;

        const response = await openai.images.generate({
          prompt,
          n: 1,
          size: "1024x1024",
          model: "dall-e-3",
        });

        row[style.toLowerCase()] = response.data[0].url;
      }

      results.push(row);
    }

    return res.json({ stylizedSets: results });
  } catch (err) {
    console.error("Generation error:", err);
    return res.status(500).json({ error: "Failed to generate styles" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
