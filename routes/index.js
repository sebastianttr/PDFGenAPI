const express = require('express');
const router = express.Router();
const logger = require("npmlog");
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { translate } = require('pdfkit');
const PDFViewConverter = require("../modules/PDFViewConverter.js");
const ipp = require('ipp');

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
  pdfViewContverter.onDone = (pdfDoc,dataBuffer) => {

    const options = {
      root: path.join(__dirname + '/../')
    };

    console.log(Buffer.concat(dataBuffer));

    let printer = ipp.Printer("http://192.168.0.104/ipp/port1",{version:'1.0'});
    let msg = {
      "operation-attributes-tag": {
        "attributes-charset":"utf-8",
        "attributes-natural-language":"en",
        "requesting-user-name": "Sebastian",
        "job-name": "Print Job",
        "document-format": "application/vnd.brother-hbp",
        "job-media-sheets":"1"
      },
      "job-attributes-tag": {
        "media": "na_letter_8.5x11in"
      },
    
      data:Buffer.concat(dataBuffer)
    };

    let jobID;
    printer.execute("Print-Job", msg, function(err, res){
      if(err){
        console.log(err)
      }

      jobID = res["job-id"];
      console.log(jobID);
    });

    /*
    
    var send_msg = {
      "operation-attributes-tag": {
        "job-id": jobID,
        "requesting-user-name": "Sebastian",
        "document-format": "application/vnd.brother-hbp",
        "job-media-sheets"
      },
      data: Buffer.concat(dataBuffer)
    };
    
    printer.execute('Get-Job-Attributes', null, function (err, res) {
      if(err){
        console.log(err)
      }
        console.log(res);
    });
    */

  
    

/*
    printer.printFile({filename:"output.pdf",
      printer: process.env[3], // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log("sent to printer with ID: "+jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
    */
    
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


router.get('/ping',(req,res,next) => {
  res.send("Pong");
})

module.exports = router;
