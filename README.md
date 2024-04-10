### Prizm Doc Server REST API Content Conversion Service App

This Node & Express app uses the PrizmDoc Servers `Content Conversion Service REST API`. The _content converters_ REST API allows your application to convert files from a variety of input [formats](https://help.accusoft.com/PrizmDoc/latest/HTML/supported-file-formats.html) to several common output formats: **PDF, TIFF, PNG, JPEG, SVG, DOCX, XLSX**.

The API documentation is _excellent_. You can find it [here](https://help.accusoft.com/PrizmDoc/latest/HTML/content-converters.html).

The project is mainly a learning exercise to get to know the API better. I was surprised how much I _didn't_ know about HTTP requests/responses, that's for sure.

It is also **not finished** and a "_work-in-progress_". ..if you are new to Node.js and Express this _could possibly_ be a simple outline/guide for how to work with some of the Prizmdoc Server API endpoints.

A very quick summary of the coversion process is as follows:

To convert a file using the REST API:

-   Upload a file you want to use as input using the WorkFile API.
-   Start a conversion operation by using the POST URL below.
-   Check the status of the conversion by (repeatedly) using the GET URL below.
-   When complete, a separate output file will exist which you can download via the WorkFile API.

### Tech Stack

-   [Node.js](https://nodejs.org/en/)
-   [Express.js](https://expressjs.com/)
-   [Axios](https://www.npmjs.com/package/axios)
-   [dotenv](https://www.npmjs.com/package/dotenv)
-   `...`

### Installation/Usage

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file in the root directory and add the following: `API_KEY=your_api_key_here`
4. Go to `127.0.0.1:3030` in your browser and you should see a HTML page with an upload button to uplod your files to the API.
