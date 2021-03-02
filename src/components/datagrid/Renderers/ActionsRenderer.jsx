import React, { useState, useEffect } from 'react';
import { useComponentWillMount } from '../utils';
import Hotkeys from 'react-hot-keys';

// const saveRowChanges = (row) => {
//     console.log("GOT UPDATE ON ROW:", row.data);
// }

export default (props) => {
    let [editing, setEditing] = useState(false);
    let [disabled, setDisabled] = useState(false);

    // custom hook
    useComponentWillMount(() => {
        let editingCells = props.api.getEditingCells();
        if (editingCells.length !== 0) {
            setDisabled(true);
        }
    })

    useEffect(() => {
        props.api.addEventListener('rowEditingStarted', onRowEditingStarted);
        props.api.addEventListener('rowEditingStopped', onRowEditingStopped);

        return () => {
            props.api.removeEventListener('rowEditingStarted', onRowEditingStarted);
            props.api.removeEventListener('rowEditingStopped', onRowEditingStopped);
        };
    }, []);

    function onRowEditingStarted(params) {
        if (props.node === params.node) {
            setEditing(true);
        } else {
            setDisabled(true);
        }
    };

    function onRowEditingStopped(params) {
        if (props.node === params.node) {
            if (isEmptyRow(params.data)) {
                deleteRow(true);
            } else {
                setEditing(false);
                //saveRowChanges(props.node);
                // console.log(props);
                // console.log(props.btnUpdateHandler);
                // if (props.column.userProvidedColDef.validaterowfunction(props.node)) {
                //  props.column.userProvidedColDef.btnUpdateHandler(props.node);
                //  setEditing(false);
                // }else{
                //     startEditing();
                // }
               //props.btnUpdateHandler(props.node);

               //props.column.userProvidedColDef.btnUpdateHandler(props.node);
            }
        } else {
            setDisabled(false);
        }
    }

    function startEditing() {
        props.api.startEditingCell({
            rowIndex: props.rowIndex,
            colKey: props.column.colId
        });
    }

    function stopEditing(bool) {

        if (!bool ) {
            if (props.column.userProvidedColDef.validaterowfunction(props.node)) {
                props.api.stopEditing(bool);
            props.column.userProvidedColDef.btnUpdateHandler(props.node);
            //props.column.userProvidedColDef.btnUpdateHandler(props.node);
            

           } else {
               return;
           }
        }

        props.api.stopEditing(bool);

        
    }

    function deleteRow(force = false) {
        let data = props.data;
        let confirm = true;
        if (!force) {
            confirm = window.confirm(`are you sure you want to delete this row: ${JSON.stringify(data)})`)
        }
        if (confirm) {
            props.api.updateRowData({ remove: [data] });
            props.api.refreshCells({ force: true });
        }
    };

    function isEmptyRow(data) {
        let dataCopy = { ...data };
        delete dataCopy.id;
        return !Object.values(dataCopy).some(value => value);
    }

    const  onKeyUp = (keyName, e, handle) => {
        console.log("test:onKeyUp", e, handle)
      }
      const onKeyDown = (keyName, e, handle) => {
        console.log("test:onKeyDown", keyName, e, handle)
        stopEditing(false);
      }

      const  onKeyUp2 = (keyName, e, handle) => {
        console.log("test:onKeyUp", e, handle)
      }
      const onKeyDown2 = (keyName, e, handle) => {
        console.log("test:onKeyDown", keyName, e, handle)
        stopEditing(true);
      }

    return (
        <div>
      <Hotkeys 
        keyName="ctrl+b" 
        onKeyDown={onKeyDown.bind(this)}
        onKeyUp={onKeyUp.bind(this)}
      >

      </Hotkeys>

      <Hotkeys 
        keyName="alt+g" 
        onKeyDown={onKeyDown2.bind(this)}
        onKeyUp={onKeyUp2.bind(this)}
      >

      </Hotkeys>

            {editing
                ? <>
                    <button
                        color="primary"
                        variant="contained"
                        onClick={() => stopEditing(false)}
                        disabled={disabled}>Update</button>
                    <button
                        color="secondary"
                        variant="contained"
                        onClick={() => stopEditing(true)}
                        disabled={disabled}>Cancel</button>
                </>
                : <>
                    <button
                        color="primary"
                        variant="outlined"
                        onClick={startEditing}
                        disabled={disabled}>Edit</button>
                    <button
                        color="secondary"
                        variant="outlined"
                        onClick={() => deleteRow()}
                        disabled={disabled}>Delete</button>
                </>
            }
        </div>
    )
}
