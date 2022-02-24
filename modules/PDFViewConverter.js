const logger = require("npmlog");
const fs = require('fs');

class PDFViewConverter{

    _TAG = "PDFGenAPI [PDFViewConverter]";

    onDone = () => {};

    constructor(pdfCtx,filePath){
        this.ctx = pdfCtx;

        this.fsWriteStream = fs.createWriteStream(filePath);

        this.dataBuffer = [];

        this.ctx.on("end",() => {
            this.onDone(this.ctx,this.dataBuffer);
        })


    }

    generateFromView(view){

        this.ctx.pipe(this.fsWriteStream)

        this.ctx.on('data',this.dataBuffer.push.bind(this.dataBuffer));

        view.forEach((el) => {
            switch(el.type){
                case "Text":
                    //logger.info(this._TAG,"Type is text")
                    const text = el.text;
                    const fontSize = el.fontSize || 15;
                    const fontStyle = el?.fontStyle || "";
                    const x = el.x;
                    const y = el.y;
                    const textAlign = el?.textAlign || "left";

                    this.ctx.fontSize(fontSize)
                            .text(text, x, y,{
                                align:textAlign
                            });
                    
                    break;
                default:
                    logger.info(this._TAG,"Type is unknown / undefined");
                    break;
            }
        })

        this.ctx.end();        
    }

}

module.exports = PDFViewConverter;