import React, { Component, createRef } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
// import Container from '@material-ui/core/Container';
import NavBarMS from './NavBarMS';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import 'bootstrap/dist/css/bootstrap.css';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import { render } from 'react-dom';


import Docubrowser from './Docubrowser';
import ApexMonitoring from './ApexMonitoring';
import Prognotes from './Prognotes';
import Apexclaims from './ApexClaims';

const { ipcRenderer } = window.require("electron");


class AppNoAuth extends Component {

   openPDF = () => {
    console.log("Renderer sending message to main");
    ipcRenderer.send('show-file', 'ping')
  }

  getPDFPage = () => {

    console.log("Called Get Page Number");

    const iframePdf = this.state.iframeRef.current.contentWindow;
    console.log(iframePdf);
    console.log(iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber);
    if (this.iframePdf !== undefined) {
       const iframePdf = this.iframePdf.contentWindow;
       iframePdf.print();
    }



  };

  nextPDFPage = () => {

    console.log("Called Next Page Number");

    const iframePdf = this.state.iframeRef.current.contentWindow;
    console.log(iframePdf);
    console.log(iframePdf.PDFViewerApplication.pdfViewer.currentPageNumber += 1 );

    iframePdf.PDFViewerApplication.pdfDocument.getPage(1).then(pdfPage => { pdfPage.getTextContent().then(data => { console.log(data); }); });

  };


  state = {
    filepath : "",
    iframeRef : createRef()
  }
  componentDidMount =() => {

    ipcRenderer.on ('selectedFile', (event, path) => {
      console.log("Client got: Show file " + path);

      const element = `<h1>Hello, world</h1> ${path}`;



      // const iframe = document.createElement('iframe');
      // iframe.src = `../public/pdfjs/web/viewer.html?file=${path}`;

      // const frame_element = `
      // <iframe width="100%" height="600px"
      // src = "${path}"
      // />
      // `;

      //       const frame_element = `
      // <iframe width="100%" height="600px"
      // src = "../public/pdfjs/web/viewer.html?file=${path}"
      // />
      // `;

           const frame_element = `../public/pdfjs/web/viewer.html?file=${path}`;


      //../public/pdfjs/web/viewer.html?file=${filePath}

      this.setState( { filepath : frame_element});

      // render(frame_element, document.getElementById('viewer').innerHTML);
      // ReactDOM.render(element, document.getElementById('root'));
    })

  };

    //  {/* <div style={{width: "100%", minHeight: 300, backgroundColor: 'orange' }} class='viewer' id='viewer'> */}


  render() {
    let error = null;
    if (this.props.error) {
      error = <ErrorMessage
        message={this.props.error.message}
        debug={this.props.error.debug} />;
    }

    return (
        <div style={{width: "100%"}}>
             <div class='picker'>
      <button  id='myButton' onClick={this.openPDF} >Select PDF to view</button>
      <button  id='myButton' onClick={this.getPDFPage} >GetPageNumber</button>
      <button  id='myButton' onClick={this.nextPDFPage} >Next Page </button>

    </div>


{/*
    <div style={{width: "100%", minHeight: 600, backgroundColor: 'orange' }} dangerouslySetInnerHTML={{ __html: this.state.filepath }} /> */}

<div style={{width: "100%", minHeight: 600, backgroundColor: 'orange' }} >

<iframe width="100%" height="600px" ref={this.state.iframeRef}
      src = { this.state.filepath}
      />

  </div>

            <Docubrowser />
          </div>
    );
  }
}

export default AppNoAuth;
