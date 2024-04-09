const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer(); // multer for file uploads
const util = require("util");
require("dotenv").config();

const baseURL = "https://api.accusoft.com";
const fileExtension = "docx";
const apiKey = process.env.API_KEY;

// Home page
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// --------------------------------------------------------

const workFile = async (fileBuffer, res) => {
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseURL}/PCCIS/V1/WorkFile?FileExtension=${fileExtension}`,
        headers: {
            "Content-Type": "application/octet-stream",
            "Accusoft-Affinity-Hint": "pdf",
            "Acs-Api-Key": apiKey,
        },
        fileBuffer: fileBuffer,
    };

    try {
        const response = await axios(config); // send the request to the API
        if (response.status !== 200) {
            res.status(500).send("Call to fileId API caused an error!");
            return;
        }

        // Create a workFile object to store all the values
        const workFile = {
            fileId: response.data.fileId,
            affinityToken: response.data.affinityToken,
        };

        return workFile; // return the workFile object ---> { fileId: '...', affinityToken: '...'}
    } catch (error) {
        console.log("error->", error);
    }
};

// --------------------------------------------------------

// This functions main role is to get the `processId` (from the `inputObj`)
// You will use this processId in subsequent GET calls to get the status and final results of the conversion
const contentConverter = async (workFileObj, res) => {
    const fileId = workFileObj.fileId; // get the fileId from the workFile object
    const affinityToken = workFileObj.affinityToken; // get the affinityToken from the workFile object

    let data = JSON.stringify({
        input: {
            sources: [
                {
                    fileId: fileId,
                },
            ],
            dest: {
                format: "pdf",
            },
        },
    });

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseURL}/v2/contentConverters`,
        headers: {
            "Content-Type": "application/json",
            "Accusoft-Affinity-Token": affinityToken,
            "Acs-Api-Key": apiKey,
        },
        data: data,
    };

    // ------------------------------------------

    try {
        const response = await axios(config); // send the request to the API
        if (response.status !== 200) {
            res.status(500).send("POST request to /v2/contentConverters failed");
            return;
        }

        // Create a contentConverter object to store all of the response data for use in the next function
        // This object will be used to get the `processId` and other values `{input, processId, state, percentComplete, affinityToken}`
        const contentConverterObj = {
            input: response.data.input, // contains your fileId
            processId: response.data.processId,
            state: response.data.state,
            percentComplete: response.data.percentComplete,
            affinityToken: affinityToken, // from the workFile object
        };

        return contentConverterObj; // return the contentConverter object
    } catch (error) {
        console.log("error ->", error);
    }
};

// --------------------------------------------------------

// Gets the status of a content conversion operation and its final output if available.
const getConversionStatus = async (contentConverterObj, res) => {
    const url = `${baseURL}/v2/contentConverters/${contentConverterObj.processId}`;
    let config = {
        method: "get",
        url: url,
        headers: {
            "Accusoft-Affinity-Token": contentConverterObj.affinityToken,
            "Acs-Api-Key": apiKey,
        },
    };

    // ---------------- poll for state ---------------- //

    try {
        let currentState;
        let processingObj;
        do {
            let response = await axios(config); // send the request to the API
            processingObj = response.data; // store entire response object in an `input` object
            currentState = processingObj.state; // store the current state & check for "processing" | "complete"

            // conditional check for polling interval
            if (currentState !== "complete") {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        } while (currentState !== "complete");

        // Now state should be "complete" & output section will list one or more WorkFile ids

        // get fileId for out last api call to: `/PCCIS/V1/WorkFile/${fileId}`
        let fileId = processingObj.output.results[0].fileId; //processingObj

        // Create an outputFile object to store the fileId and the inputObj
        let workFileOutputObj = {
            processingObj: processingObj,
        };

        return workFileOutputObj;

        // --- error handling --- //
    } catch (error) {
        console.log("error ->", error);
    }
};

// --------------------------------------------------------

const getOutputFile = async (workFileOutputObj, res) => {
    let url = `${baseURL}/PCCIS/V1/WorkFile/${workFileOutputObj.processingObj.output.results[0].fileId}`;

    let config = {
        method: "get",
        url: url,
        headers: {
            "Acs-Api-Key": apiKey,
            // "Content-Type": "application/octet-stream", // check
            "Accusoft-Affinity-Token": workFileOutputObj.affinityToken, // check this...
            //"Content-Disposition": "attachment; filename=output.pdf",
        },
    };

    try {
        let response = await axios(config); // send the request to the API
        if (response.status !== 200) {
            res.status(500).send("GET request to /PCCIS/V1/WorkFile/{fileId} failed");
            return;
        }

        // log entire response data
        console.log(util.inspect(response.data, false, null, true));

        // ================== TODO: ===============================
        // TODO:
        // fs.writeFileSync("output.pdf", response.data, "binary");

        // TODO: send the file to the client???
        // res.download("output.pdf");
        // ================== TODO: ===============================

        // --- error handling --- //
    } catch (error) {
        console.log("error ->", error);
    }
};

// --------------------------------------------------------

router.post("/api/upload", upload.single("inputfile"), async (req, res) => {
    const fileBuffer = req.file.buffer; // A Buffer containing the entire file
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        // send a fileBuffer to get -> fileId
        let workFileObj = await workFile(fileBuffer, res); // returns fileId & affinityToken values

        // use fileId to get the input object `input {...}`
        let contentConverterObj = await contentConverter(workFileObj, res);

        // polls the API until the process is complete
        let workFileOutputObj = await getConversionStatus(contentConverterObj, res);

        // ================== TODO: ===============================
        // TODO: get the final output file...
        // --------------------------------------------------------
        const outputFile = await getOutputFile(workFileOutputObj, res);

        // --- error handling --- //
    } catch (error) {
        console.log(error);
        // res.status(500).send("An error occurred.");
    }
});

// ------------------------------------------------------------------

module.exports = router;
