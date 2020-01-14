import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Input} from 'semantic-ui-react'
import TokenSelector from './TokenSelector'
import AmountInputContainer from './AmountInputContainer'
import AddressInputContainer from './AddressInputContainer'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const tokenOptions = [
    {
        key: 'DAI',
        value: 'Dai Stablecoin',
        text: 'Dai Stablecoin',
    },
    {
        key: 'USDc',
        text: 'USD Coin',
        value: 'USD Coin',
    },
    {
        key: 'cDAI',
        text: 'Compound Dai',
        value: 'Compound Dai',
    },
    {
        key: 'cUSD',
        text: 'Compound USD Coin',
        value: 'Compound USD Coin',
    },
]

const StreamForm = ({web3}) => {
    const [token, setToken] = useState(tokenOptions[0].value)
    const [decimals, setDecimals] = useState(web3.utils.toBN(18))   // TODO: Remove default value
    const [amount, setAmount] = useState(web3.utils.toBN(0))
    const [recipient, setRecipient] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [days, setDays] = useState(1)

    const onStartDateChange = (ev, data) => {
        const dateString = data.value
        console.log('date changed: ' + dateString)
        setStartDate(new Date(dateString))
    }

    const onDaysChange = (ev) => {
        const newDays = ev.target.value
        console.log(`Days changed to ${newDays}`)
        setDays(newDays)
    }

    return (
        <Form>
            <Form.Field>
                <label>What token do you want to use?</label>
                <TokenSelector
                    tokenOptions={tokenOptions}
                    token={token}
                    onChange={setToken}
                />
            </Form.Field>
            <Form.Field>
                <label>How much do you want to stream?</label>
                <AmountInputContainer web3={web3} amount={amount} setAmount={setAmount} decimals={decimals}/>
            </Form.Field>
            <Form.Field>
                <label>Who is the recipient?</label>
                <AddressInputContainer setAddress={setRecipient} web3={web3}/>
            </Form.Field>
            <Form.Field>
                <label>When should the stream start</label>
                <SemanticDatepicker
                    value={startDate}
                    onChange={onStartDateChange}
                />
            </Form.Field>
            <Form.Field>
                <label>For how long should the money be streamed?</label>
                <Input
                    label={'days'}
                    labelPosition={'right'}
                    type={'number'}
                    value={days}
                    onChange={onDaysChange}
                />
            </Form.Field>
            <Button type='submit'>Submit</Button>
        </Form>
    )
}

StreamForm.propTypes = {
    web3: PropTypes.object.isRequired,
}

export default StreamForm