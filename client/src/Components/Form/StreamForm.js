import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Form} from 'semantic-ui-react'
import TokenSelector from './TokenSelector'
import AmountInputContainer from './AmountInputContainer'
import AddressInputContainer from './AddressInputContainer'
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
    const [amount, setAmount] = useState(web3.utils.toBN(0))
    const [decimals, setDecimals] = useState(web3.utils.toBN(18))   // TODO: Remove default value
    const [recipient, setRecipient] = useState('')
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
                <label>For how long should the money be streamed?</label>
                <input placeholder='5 years' />
            </Form.Field>
            <Button type='submit'>Submit</Button>
        </Form>
    )
}

StreamForm.propTypes = {
    web3: PropTypes.object.isRequired,
}

export default StreamForm