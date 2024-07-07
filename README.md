### Prizm Doc Server REST API Content Conversion Service App

The project is mainly a learning exercise to get to know the [PrizmDoc Server REST API](https://help.accusoft.com/PrizmDoc/latest/HTML/prizmdoc-server-api-overview.html) better. I was surprised how much I _didn't_ know about `HTTP` requests & responses and how to work with them in Node.js. It, the project, is also _not finished_, but I wanted to share it anyway. I will be updating it and completing it soon though.

The API documentation is _excellent_. You can find it [here](https://help.accusoft.com/PrizmDoc/latest/HTML/content-converters.html) and the previous link is a good starting point to get to know the API better. All the information you need to get started is there, can't say the same for the documentation of some other APIs I've worked with.

I used the `Content Conversion Service REST API` which allows your application to convert files from a variety of input [formats](https://help.accusoft.com/PrizmDoc/latest/HTML/supported-file-formats.html) to several common output formats: **PDF, TIFF, PNG, JPEG, SVG, DOCX, XLSX**.

A very quick summary of the conversion process is as follows:

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
