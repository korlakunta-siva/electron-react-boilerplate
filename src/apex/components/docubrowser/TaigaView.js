import React, { useEffect, useState, createRef } from 'react'
import RGL, { WidthProvider } from 'react-grid-layout'
import ApexDataGrid from '../../../components/datagrid/ApexDataGrid'

const { ipcRenderer } = window.require('electron')
const { exec } = require('child_process')
let shell = require('electron').shell;

const ReactGridLayout = WidthProvider(RGL)

export const TaigaApp = props => {
  const onLayoutChange = layout => {
    //this.props.onLayoutChange(layout);
  }

//   useEffect(() => {
   
//   }, [])

  const [stateData, setStateData] = useState({
    searchData: [],
    iframeRef: '',
    filepath: createRef()
  })

  const [searchText, setSearchText] = useState('');

  const recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData)

    switch (gridName) {
      case DATA_CURRENT_STATUS:
        this.setState(
          {
            dataCurrentStatus: gridData,
            loaded: true
          },
          () => {
            console.log(
              'Changed state Current Status',
              this.state.dataCurrentStatus.length
            )
          }
        )
        break

      default:
    }
  }

  const onRowSelectExam = (event) => {
    console.log('AG Row selected', event);

    let selectedNodes = event.api
      .getSelectedNodes()
      .filter((node) => node.selected);
    console.log(selectedNodes);
  };

//   shell.openExternal(
//     'https://mevi01.mayo.edu:10443/ui/login.jsp'
//   );

  
const onRowSelectOpenTaiga = (data, gridname) => {
    console.log('Open Taiga View:', gridname, data);

      shell.openExternal(
    data.rowurl
  );


  }

  const onRowSelectView = (data, gridname) => {
    console.log('Transaction View:', gridname, data);
    let DbEnv = this.state.DbEnv;
    let dataArgs = { ...this.state.dataArgs };
  }

  const handleSearchTextChange = e => {
    console.log(e.target.value) // your search bar text
    setSearchText( e.target.value);
  }

  
const getHref = (project_slug, reftype, refid) => {
  let href = '';

  if (reftype == 'proj') {
    href = 'https://korlakunta.com/project/' + project_slug + '/kanban'
  } else {
    href =
      'https://korlakunta.com/project/' +
      project_slug +
      '/' +
      reftype +
      '/' +
      refid
  }

  return href
}



  const handleSearch = () => {
    console.log('Read tp search with: ' + searchText)

    fetch(
         "https://korlakunta.com/api/mysearch?token=" + searchText ,
          {}
        )
          .then((response) => {
            if (response.status !== 200) {
                console.log(response.status);
             console.log('Something went wrong in getting data');
               return
              };
            return response.json();
          })
          .then((data) => {
              if(!data) return;
            console.log(data);
            let searchResult = [];
            data.reduce((acc, curr) => {

                if (curr['errors']) {
                    return acc;
                }

                let projectid = curr['project'];
                let projectslug = curr['project_slug'];
                let projecturl = getHref(projectslug, 'proj', 0 )

                let totalhits = curr['result']['count']
                let us = curr['result']['userstories']
                let tasks = curr['result']['tasks']

                if (us && us.length > 0) {

                    us.forEach(element => {
                        let rowurl = getHref(projectslug, 'us', element.ref)

                        let rowdata = {
                            'project' : projectid,
                            'projectslug': projecturl,
                            'projecturl' : projecturl,
                            'rowurl' : rowurl,

                            'type': 'UStory',
                            'taskdesc': element['subject']
                        }
        
                        acc.push(rowdata);
                        
                    });
  

            }


                if (tasks && tasks.length > 0) {

                    tasks.forEach(element => {

                        let rowurl = getHref(projectslug, 'task', element.ref)


                        let rowdata = {
                            'project' : projectid,
                            'projectslug': projecturl,
                            'projecturl' : projecturl,
                            'rowurl' : rowurl,

                            'type': 'Task',
                            'taskdesc': element['subject']
                        }
        
                        acc.push(rowdata);
                        
                    });
  

            }

                return acc;

            }, searchResult);

            console.log(searchResult);
            
            // let dframe = data['frame0'];
            // console.log(dframe);
            // let myObj = JSON.parse(dframe);
            // console.log(myObj);
            // data = myObj['rows'];

            setStateData({...stateData, 'searchData': searchResult})

  
          });

        
  }

  return (
    <div>
      <ReactGridLayout
        className='layout'
        onLayoutChange={onLayoutChange}
        rowHeight={30}
      >
  

        <div
          key='1'
          data-grid={{
            x: 0,
            y: 3,
            w: 7,
            h: 5,
            minH: 3,
            maxH: 12,
            static: true,
            isResizable: true
          }}
        >
                     <input
            type='text'
            className='input'
            onChange={handleSearchTextChange}
            value={searchText}
            placeholder='Search...'
          />


          <input
            type='button'
            className='input'
            onClick={handleSearch}
            value='Search'
          />
          <ApexDataGrid
            key='linq'
            gridname={'transactions'}
            gridData={stateData.searchData}
            onRowSelected={onRowSelectExam}
            button2Label='Taiga'
            onButton2Callback={onRowSelectOpenTaiga}
            
          />
        </div>
      </ReactGridLayout>
    </div>
  )
}


export default TaigaApp;