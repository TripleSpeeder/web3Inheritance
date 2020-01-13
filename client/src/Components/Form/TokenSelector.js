import React from 'react'
import PropTypes from 'prop-types'
import {Select} from 'semantic-ui-react'


TokenSelector.propTypes = {
    tokenOptions: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

function TokenSelector({tokenOptions, token, onChange}) {
    function handleChange(ev, data) {
        onChange(data.value)
    }
    return (
        <Select
            placeholder={"Select Token"}
            options={tokenOptions}
            value={token}
            onChange={handleChange}
        />
    )
}

export default TokenSelector