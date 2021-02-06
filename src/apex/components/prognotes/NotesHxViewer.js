import React, { PureComponent } from 'react';
import ReactDiffViewer from 'react-diff-viewer';


const backend_api_endpoint = "https://192.168.21.199:8040/"
const backend_api_endpoint_local = "http://127.0.0.1:8040/"
const backend_db_endpoint = "https://192.168.21.199:8044/"
const backend_db_endpoint_local = "http://127.0.0.1:8044/"

const DiffMethod = {
    CHARS : 'diffChars',
    WORDS : 'diffWords',
    WORDS_WITH_SPACE : 'diffWordsWithSpace',
    LINES : 'diffLines',
    TRIMMED_LINES : 'diffTrimmedLines',
    SENTENCES : 'diffSentences',
    CSS : 'diffCss',
  };

export default class NotesHxViewer extends PureComponent {

    state = {
        encounterid : 0,
        enc_context : {},
        notes_hx : [],
        notes_ref : [],
        notes_prev : [],
        loaded : false
    };

    constructor(props) {
        super(props);

        this.setState({
            encounterid : this.props.encid
        })
        this.notesGridElement = React.createRef();

    }

    componentWillMount() {

        //this.handleNotesRefresh();
    }

    
    componentDidMount() {

        this.handleNotesRefresh(this.state.encounterid);
    }

    
  handleNotesRefresh = (encounterid) => {
    //alert ("called log refresh: ", encounterid);

    
    console.log('In Notes hx viewer refresh: ' + encounterid);
    if (encounterid == 0) return;

    let endpoint_notes_hx =
    backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20  select * from apex.pn.encounterTreatmentHx2 where encounterID = " + encounterid + "  and diagindex between 1 and 20 order by modified_at desc ";

    let endpoint_enc_context = backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20   select * from apex.pn.encountercontext (" + encounterid + ", null, null, null)";

    let endpoint_enc_reference = backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20    select * from pn.Dx_Treatements_Used where AsmtId in (select AsmtId from mobiledoc..treatmentnotes where encounterID = " + encounterid + ") order by 1,2,4 desc ";

    let endpoint_enc_prev = backend_db_endpoint + "exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=set%20rowcount%200%20     select * from pn.Dx_Treatements_Used2 where patientid = (select patientid  from mobiledoc..enc where encounterID =  " + encounterid + " ) order by 1,7 desc  ";

    
    
    
    fetch(endpoint_notes_hx, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        console.log(data);
        this.setState({ notes_hx: data, loaded: true }, () => {
            console.log(this.state.notes_hx);
        });
      });

      fetch(endpoint_enc_context, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        console.log(data);
        this.setState({ enc_context: data[0], loaded: true }, () => {
            console.log(this.state.enc_context);
        });
      });

      fetch(endpoint_enc_reference, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        console.log(data);
        this.setState({ notes_ref: data, loaded: true }, () => {
            console.log(this.state.notes_ref);
        });
      });

      fetch(endpoint_enc_prev, {})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: "Something went wrong in getting data"
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        let dframe = data["frame0"];
        let myObj = JSON.parse(dframe);
        data = myObj["rows"];
        console.log(data);
        this.setState({ notes_prev: data, loaded: true }, () => {
            console.log(this.state.notes_prev);
        });
      });      


  }



    render = () => {
        console.log('In Notes hx viewer render');
        this.setState ({ encounterid: this.props.encid    });
        //this.handleNotesRefresh(this.props.encid);
       // console.log(this.state.notes_hx);
        const dxlist = [...new Set(this.state.notes_ref.map(item => item.itemName))];
        console.log(dxlist);
        return ((<div>
            <div>
            <button onClick={this.handleNotesRefresh} >Refresh: {this.state.encounterid}</button>
            <table>
            <tr><td>BP</td><td> {this.state.enc_context.last_bp} {' => ' }{this.state.enc_context.bp}</td></tr>
            <tr><td>BMI </td><td>{this.state.enc_context.last_bmi} {' => ' }{this.state.enc_context.bmi}</td></tr>
            <tr><td>Taking </td><td>{this.state.enc_context.takingmeds} </td></tr>
            <tr><td>Not Taking</td><td>{this.state.enc_context.nottakingmeds}</td></tr>
            </table>

            </div>

            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
  <li class="nav-item">
    <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Treatment</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">HPI</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Misc</a>
  </li>
 <li class="nav-item">
    <a class="nav-link active" id="pills-contact-tab" data-toggle="pill" href="#pills-reference" role="tab" aria-controls="pills-reference" aria-selected="false">Reference</a>
  </li>
</ul>
<div class="tab-content" id="pills-tabContent">
  <div class="tab-pane fade " id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
  <table border='1px'>
             
             <tr>
                     <th width='20%'>Changed By</th>
                     <th width='80%'> 
                     Before and After showing changes, ignoring spaces and new lines" 
                     </th>
                 </tr>
             {this.state.notes_hx.filter(row => row.displaypriority == 10).map((row, index) => (
                 <tr>
                     <td width='20%'>{row.modified_at}<br/><h5>{row.user_name}</h5>{row.itemname}</td>
                     <td width='80%'> 
                     <ReactDiffViewer compareMethod={DiffMethod.WORDS   } oldValue={String(row.prev_xmldata)} newValue={String(row.xmldata)} splitView={true}  disableWordDiff={false} /> 
                     </td>
                 </tr>
             ))}
             </table>
   
  </div>
  <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
  <table border='1px'>
             
             <tr>
                     <th width='20%'>Changed By</th>
                     <th width='80%'> 
                     Before and After showing changes, ignoring spaces and new lines" 
                     </th>
                 </tr>
             {this.state.notes_hx.filter(row => row.displaypriority == 15).map((row, index) => (
                 <tr>
                     <td width='20%'>{row.modified_at}<br/><h5>{row.user_name}</h5>{row.itemname}</td>
                     <td width='80%'> 
                     <ReactDiffViewer compareMethod={DiffMethod.WORDS   } oldValue={String(row.prev_xmldata)} newValue={String(row.xmldata)} splitView={true}  disableWordDiff={false} /> 
                     </td>
                 </tr>
             ))}
             </table>
 
  </div>
  <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
      
  <table border='1px'>
             
             <tr>
                     <th width='20%'>Changed By</th>
                     <th width='80%'> 
                     Before and After showing changes, ignoring spaces and new lines" 
                     </th>
                 </tr>
             {this.state.notes_hx.filter(row => row.displaypriority == 20).map((row, index) => (
                 <tr>
                     <td width='20%'>{row.modified_at}<br/><h5>{row.user_name}</h5>{row.itemname}</td>
                     <td width='80%'> 
                     <ReactDiffViewer compareMethod={DiffMethod.WORDS   } oldValue={String(row.prev_xmldata)} newValue={String(row.xmldata)} splitView={true}  disableWordDiff={false} /> 
                     </td>
                 </tr>
             ))}
             </table>
 
  </div>
  <div class="tab-pane fade show active" id="pills-reference" role="tabpanel" aria-labelledby="pills-reference-tab">
      
  <table border='1px'>
             
             <tr>
                     <th width='20%'>Diagnosis</th>
                     <th width='40%'> 
                     Recent for this patient
                     </th>
                     <th width='40%'> 
                     Recent for this Diagnosis
                     </th>                     
                 </tr>
             {
             dxlist.map((row,index) => (
                <tr>
                <td width='20%'>{row}</td>
                <td width='40%' valign='top'> 
                <div height='500px' overflow='auto'>
                <table>
                {this.state.notes_prev.filter(row2 => row2.itemName == row).map((row3, index) => (
                    index < 7 ? <tr><td><strong>{row3.encdate}</strong><br/>{row3.Notes}</td></tr> : ""
                 ))}
                 </table> 
                 </div>
                </td>
                <td width='40%' valign='top'> 
                <div height='500px' overflow='auto'>
                <table>
                {this.state.notes_ref.filter(row2 => row2.itemName == row).map((row3, index) => (
                    index < 7 ? <tr><td>{row3.frequency}</td><td>{row3.Notes}</td></tr> : ""
                 ))}
                 </table>
                 </div>
                </td>
                 </tr>
             ))}      
             
             </table>
 
  </div>  
</div>

            </div>)
            );
    };
}
