import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const ExchangePublicTokenApp = (props) => {

    const [publicToken, setPublicToken] = useState("");
    const onGetAccessTokenClick = () => {
        const plaidData = {
            'public_token': publicToken,
            'metadata': {
                'institution': {
                    'name': "Macys - Credit Card",
                    'institution_id': 'ins_109357'
                }
            }
        }
        axios
            .post("/api/plaid/add_public_token/", plaidData)
            .then(res =>
                console.log(res)
            )
            .then(data =>
                console.log(data)
            )
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h1> Hello World!!! </h1>

            <TextField id="outlined-basic" label="public-token" variant="outlined" style={{ width: 500 }} value={publicToken} onChange={e => setPublicToken(e.target.value)} />
            <Button variant="contained" color="primary" onClick={onGetAccessTokenClick}>Get Access Token</Button>
              Public Token Value: {publicToken}
        </div>

    );
};

export default ExchangePublicTokenApp;

