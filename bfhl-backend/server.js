// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Replace these with your actual details
// const USER_ID = "john_doe_17091999";
// const EMAIL = "john@xyz.com";
// const ROLL_NUMBER = "ABCD123";

// app.get('/bfhl', (req, res) => {
//   res.json({ operation_code: 1 });
// });

// app.post('/bfhl', (req, res) => {
//   try {
//     const { data } = req.body;

//     if (!Array.isArray(data)) {
//       throw new Error('Invalid input: data should be an array');
//     }

//     const numbers = data.filter(item => !isNaN(item));
//     const alphabets = data.filter(item => isNaN(item) && item.length === 1);
//     const highestAlphabet = alphabets
//       .filter(char => char === char.toLowerCase())
//       .sort((a, b) => b.localeCompare(a))
//       .slice(0, 1);

//     res.json({
//       is_success: true,
//       user_id: USER_ID,
//       email: EMAIL,
//       roll_number: ROLL_NUMBER,
//       numbers: numbers,
//       alphabets: alphabets,
//       highest_alphabet: highestAlphabet
//     });
//   } catch (error) {
//     res.status(400).json({ is_success: false, error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileType = require("file-type"); // Import file-type for more accurate MIME detection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ msg: "try endpoint /bfhl" });
});

// Helper function to find the highest lowercase alphabet
function findHighestLowercaseAlphabet(alphabets) {
  return alphabets
    .filter((char) => /[a-z]/.test(char))
    .sort((a, b) => b.localeCompare(a))[0];
}

// Helper function to validate base64 string
function isValidBase64(str) {
  try {
    const regex =
      /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return regex.test(str);
  } catch (error) {
    return false;
  }
}

// POST endpoint
app.post("/bfhl", async (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ is_success: false, error: "Invalid input format" });
    }

    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => isNaN(item) && item.length === 1);
    const highestLowercaseAlphabet = findHighestLowercaseAlphabet(alphabets);

    // File handling
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = null;

    if (file_b64) {
      if (isValidBase64(file_b64)) {
        try {
          const fileBuffer = Buffer.from(file_b64, "base64");

          // Use file-type library to determine MIME type
          const fileTypeResult = await fileType.fromBuffer(fileBuffer);

          fileValid = true;
          fileMimeType = fileTypeResult
            ? fileTypeResult.mime
            : "application/octet-stream";
          fileSizeKb = (fileBuffer.length / 1024).toFixed(2); // Size in KB
        } catch (error) {
          console.error("File processing error:", error);
        }
      } else {
        return res
          .status(400)
          .json({ is_success: false, error: "Invalid base64 string" });
      }
    }

    const response = {
      is_success: true,
      user_id: "Aadesh_Gupta", 
      email: "ag9494@srmist.edu.in", 
      roll_number: "RA2111026030159",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet
        ? [highestLowercaseAlphabet]
        : [],
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ is_success: false, error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/bfhl", (req, res) => {
    res.status(200).json({ operation_code: 1 });
  });