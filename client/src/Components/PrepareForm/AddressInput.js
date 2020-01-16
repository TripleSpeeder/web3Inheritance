import React from 'react'
import PropTypes from 'prop-types'
import {Form} from "semantic-ui-react"

const AddressInput = (props) => {
    const {handleInput, loading, error, value} = props

    const handleChange = async (e) => {
        const input=e.target.value
        handleInput(input)
    }

    return (
        <Form.Field>
            <label>Who is the recipient?</label>
            <Form.Input
                    name='address'
                    placeholder='Address or ENS Name'
                    error={error}
                    loading={loading}
                    onChange={handleChange}
                    value={value}
            />
        </Form.Field>
    )
}

AddressInput.propTypes = {
    value: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    handleInput: PropTypes.func.isRequired,
}

export default AddressInput
