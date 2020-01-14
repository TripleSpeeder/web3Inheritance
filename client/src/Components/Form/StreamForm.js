import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Input, Message} from 'semantic-ui-react'
import TokenSelector from './TokenSelector'
import AmountInputContainer from './AmountInputContainer'
import AddressInputContainer from './AddressInputContainer'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import bnToDisplayString from '@triplespeeder/bn2string'
import dayjs from 'dayjs'

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
    const secondsPerDay = 24*60*60
    const [token, setToken] = useState(tokenOptions[0].value)
    const [decimals, setDecimals] = useState(web3.utils.toBN(18))   // TODO: Remove default value
    const [amount, setAmount] = useState(web3.utils.toBN(0))
    const [recipient, setRecipient] = useState('')
    const [durationSeconds, setDurationSeconds] = useState(secondsPerDay)

    // summary
    const [endTimestamp, setEndTimestamp] = useState()
    const [dailyRate, setDailyRate] = useState({precise: '', rounded: '', amount:web3.utils.toBN(0)})

    // calculate daily rate whenever amount or duration changes
    useEffect(() => {
        const calcRate = () => {
            let amountPerSecond = amount.div(web3.utils.toBN(durationSeconds))
            let amountPerDay = amountPerSecond.mul(web3.utils.toBN(secondsPerDay))
            let {precise, rounded} = bnToDisplayString({
                value: amountPerDay,
                decimals: decimals,
                roundToDecimals: web3.utils.toBN(3)
            })
            setDailyRate({precise, rounded, amount: amountPerDay})
        }
        if (amount.gt(0)){
            calcRate()
        }
    }, [amount, durationSeconds])

    // Calculate new duration and endTimestamp
    const onDaysChange = (ev) => {
        const newDays = ev.target.value
        const seconds = parseInt(newDays)*secondsPerDay
        console.log(`Days changed to ${newDays} (${seconds} seconds)`)
        let timestamp = dayjs().unix() + seconds
        console.log(`New endTimestamp: ${timestamp}`)
        setDurationSeconds(seconds)
        setEndTimestamp(timestamp)
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
                <label>For how long should the money be streamed?</label>
                <Input
                    label={'days'}
                    labelPosition={'right'}
                    type={'number'}
                    onChange={onDaysChange}
                    min={1}
                    max={3650}
                    default={30}
                />
            </Form.Field>
            <Message>
                <Message.Header>Summary</Message.Header>
                <Message.List>
                    <Message.Item>Stream will run until {dayjs.unix(endTimestamp).toString()}</Message.Item>
                    <Message.Item>{recipient} will receive {dailyRate.rounded} per day</Message.Item>
                </Message.List>
            </Message>
            <Button type='submit'>Submit</Button>
        </Form>
    )
}

StreamForm.propTypes = {
    web3: PropTypes.object.isRequired,
}

export default StreamForm