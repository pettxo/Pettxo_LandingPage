const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SURVEY_FILE = "survey_responses.xlsx";
const WAITLIST_FILE = "waitlist.xlsx";

// Validate input data
const validateData = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== "string") {
      return false;
    }
  }
  return true;
};

// Save data to Excel
const saveToExcel = (data, file, sheetName) => {
  let workbook, worksheet;
  try {
    if (fs.existsSync(file)) {
      workbook = XLSX.readFile(file);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      rows.push(Object.values(data));
      worksheet = XLSX.utils.aoa_to_sheet(rows);
    } else {
      worksheet = XLSX.utils.aoa_to_sheet([
        Object.keys(data),
        Object.values(data),
      ]);
      workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
    XLSX.writeFile(workbook, file);
    return true;
  } catch (error) {
    console.error(`Error writing to ${file}:`, error);
    return false;
  }
};

// Survey endpoint
app.post("/api/survey", (req, res) => {
  const data = req.body;
  const requiredFields = ["firstName", "emailPrimary", "location", "q_ownPet"];
  if (!validateData(data, requiredFields)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid or missing required fields" });
  }

  const surveyData = {
    "First Name": data.firstName || "",
    "Last Name": data.lastName || "",
    Email: data.emailPrimary || "",
    "Email Confirm": data.emailConfirm || "",
    Location: data.location || "",
    "Do you currently own a pet?": data.q_ownPet || "",
    "What type(s) of pet do you have?": data.q_petTypes || "",
    "What breed(s) is your pet?": data.q_breeds || "",
    "What is the gender of your pet?": data.q_petGender || "",
    "What is your biggest challenge with pet care?":
      data.q_biggestChallenge || "",
    "When do you plan to get a pet?": data.q_when || "",
    "What type of pet are you interested in?": data.q_preferredType || "",
    "What is your primary concern when it comes to pet care?":
      data.q_mainConcern || "",
    "What type of pet-related service do you offer?": data.q_offerService || "",
    "What specific services do you provide?": data.q_serviceTypes || "",
    "What apps or platforms do you currently use?": data.q_currentApps || "",
    "How often would you like to receive content?":
      data.q_contentFrequency || "",
    "Which platform(s) are you interested in?": data.q_platformInterest || "",
    "How likely are you to use Pettxo?": data.q_earlyAccess || "",
    "What features would you find useful?": data.q_features || "",
  };

  const success = saveToExcel(surveyData, SURVEY_FILE, "Responses");
  if (success) {
    res.json({ success: true });
  } else {
    res
      .status(500)
      .json({ success: false, error: "Failed to save survey data" });
  }
});

// Waitlist endpoint
app.post("/api/waitlist", (req, res) => {
  const data = req.body;
  const requiredFields = ["email"];
  if (!validateData(data, requiredFields)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid or missing email" });
  }

  const waitlistData = {
    Timestamp: new Date().toISOString(),
    Email: data.email || "",
    Name: data.name || "",
    "Pet Type": data.petType || "",
    Source: data.source || "waitlist",
  };

  const success = saveToExcel(waitlistData, WAITLIST_FILE, "Waitlist");
  if (success) {
    res.json({ success: true });
  } else {
    res
      .status(500)
      .json({ success: false, error: "Failed to save waitlist data" });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
