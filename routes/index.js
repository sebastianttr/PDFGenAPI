const express = require('express');
const router = express.Router();
const logger = require("npmlog");
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { translate } = require('pdfkit');
const PDFViewConverter = require("../modules/PDFViewConverter.js");


/**
 * Generate a PDF out of a object containing information about the view
 * A PDF will be generated which has a certain ID, which the user receives back 
 * 
 * We need a PDF ID because it will mos probably take some time to generate.
 * IF it works without, then forget IDs
 * 
 * @param {Object} view
 */
router.post('/generate',(req,res,next) => {
  

  // get view
  const view = req.body;
  
  logger.info(view[0].type);

  // Create a document
  let pdfViewContverter;
  const doc = new PDFDocument();

  

  pdfViewContverter = new PDFViewConverter(doc,'output.pdf');
  pdfViewContverter.onDone = () => {

    const options = {
      root: path.join(__dirname + '/../')
    };
    
    /*
    res.sendFile("output.pdf",options,(err) => {
      if(err){
        logger.error("PDFGenAPI index.js","Send File error: " + err)
      }else {
        fs.rmSync(options.root + "output.pdf", {
          force: true,
        });
      }
    })
    */

    res.send("PDF created");
  }
  pdfViewContverter.generateFromView(view);
})

module.exports = router;
