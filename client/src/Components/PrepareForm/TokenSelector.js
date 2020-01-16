import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Dropdown, Form} from 'semantic-ui-react'


TokenSelector.propTypes = {
    availableTokens: PropTypes.object.isRequired,
    token: PropTypes.object,
    selectToken: PropTypes.func.isRequired,
}

function TokenSelector({availableTokens, token, selectToken}) {

    const [tokenOptions, setTokenOptions] = useState([])
    const [selectedToken, setSelectedToken] = useState()

    useEffect(() => {
        if (token) {
            console.log("new token via props: " + token.name)
            setSelectedToken(token)
        } else {
            console.log("Got empty token via props")
        }
    }, [token])

    useEffect(() => {
        setTokenOptions(Object.entries(availableTokens).map(entry => (
            {
                value: entry[0],  // contract address
                key:  entry[0],  // contract address
                text: entry[1].name,
            }
        )))
    }, [availableTokens])


    function handleChange(ev, data) {
        const selectedTokenEntry = availableTokens[data.value]
        console.log(selectedTokenEntry)
        selectToken(selectedTokenEntry)
    }

    return (
        <Form.Field>
            <label>What token do you want to use?</label>
            <Dropdown
                selection
                placeholder={"Select Token"}
                options={tokenOptions}
                value={selectedToken ? selectedToken.address : undefined}
                onChange={handleChange}
            />
            </Form.Field>
    )
}

export default TokenSelector