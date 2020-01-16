import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input} from 'semantic-ui-react'

const DurationInput = (props) => {
    const {handleDuration} = props
    const secondsPerDay = 24*60*60

    const handleChange = async (ev) => {
        const newDays = ev.target.value
        let seconds = parseInt(newDays)*secondsPerDay
        if (seconds.isNaN) {
            console.log(`newDays is NAN`)
            seconds=0
        }
        console.log(`Days changed to ${newDays} (${seconds} seconds)`)
        handleDuration(seconds)
    }

    return (
        <Form.Field>
            <label>For how long should the money be streamed?</label>
            <Input
                label={'days'}
                labelPosition={'right'}
                type={'number'}
                onChange={handleChange}
                min={1}
                max={3650}
            />
        </Form.Field>
    )
}

DurationInput.propTypes = {
    handleDuration: PropTypes.func.isRequired,
}

export default DurationInput
