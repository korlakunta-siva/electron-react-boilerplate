import React, { Component } from "react";
//mport ReactDOM from "react-dom";
import { Document, Page , pdfjs } from "react-pdf";

//import { Document, Page, pdfjs } from 'react-pdf/dist/entry.webpack';
//import 'react-pdf/dist/Page/AnnotationLayer.css';

//import { Document, Page , pdfjs} from "react-pdf/dist/entry.webpack";
//import "react-pdf/dist/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.js';
pdfjs.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.js';
pdfjs.disableworker = true;
//pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';


const backend_api_endpoint =        "https://192.168.21.199:8040/"
const backend_api_endpoint_local =  "http://127.0.0.1:8040/"
const backend_db_endpoint =         "https://192.168.21.199:8044/"
const backend_db_endpoint_local =   "http://127.0.0.1:8044/"

export default class PdfView extends Component {
    //state = { numPages: null,  filename : 'abc'};
    //pageNumber: 1 ,

    //constructor (props) {
    //    super(props); 
    //    this.state.filename = props.filename;
    //    console.log("Got: " + this.state.filename);

   // }
    // onDocumentLoadSuccess = ({ numPages }) => {
    //     this.setState({ numPages },
    //         this.props.onDocumentLoaded(numPages));
    // };


   // handleChange() {
   //     this.props.onPageChange(this.state.pageNumber);
   //   }

        getFilePath(filename) {
            return "http://localhost:9041/frontend/getpdf?name=" + filename;
        }

    render(props) {
        //const {  numPages , filename} = this.state;
        //let pageNumber = this.props.pageNumber ? this.props.pageNumber  : 1;

        return (
            <div>

                <div >
                    { this.props.filename != 0 ?   
                    <Document style={{ width: '100%' }}
                        file={`${backend_api_endpoint}retrievefile?filepath=${this.props.filename}&filename=${this.props.filename}`}
                        onLoadSuccess={this.props.onDocumentLoaded}
                    >
                        <Page pageNumber={this.props.pageNumber} width={600} />
                    </Document>
                    : ""
                }
                </div>


            </div>
        );
    }
}

// const pdfdoc = document.getElementById("pdfview");
//                        file={`http://localhost:9041/statement?patid=${this.state.filename}`}

// pdfdoc ? ReactDOM.render(<PdfView filename='example.pdf' />, pdfdoc) : null; 