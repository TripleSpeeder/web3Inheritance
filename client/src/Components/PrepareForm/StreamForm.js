import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Input, Message, Segment} from 'semantic-ui-react'
import TokenSelector from './TokenSelector'
import AmountInputContainer from './AmountInputContainer'
import AddressInputContainer from './AddressInputContainer'
import bnToDisplayString from '@triplespeeder/bn2string'
import dayjs from 'dayjs'


const StreamForm = ({web3, createForm, cancel, availableTokens}) => {

    const secondsPerDay = 24*60*60

    const [token, setToken] = useState()
    const [decimals, setDecimals] = useState(web3.utils.toBN(18))   // TODO: Remove default value
    const [amount, setAmount] = useState(web3.utils.toBN(0))
    const [recipient, setRecipient] = useState('')
    const [durationSeconds, setDurationSeconds] = useState(web3.utils.toBN(0))
    const [valid, setValid] = useState(false)

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
        if (amount.gt(0) && (durationSeconds>0)){
            calcRate()
        }
    }, [amount, durationSeconds])

    // Simple form validation. Should be replaced with sth like react-formik later
    useEffect(() => {
        console.log(`Checking form valid: amount ${amount} recipient ${recipient} duration ${durationSeconds}`)
        const formValid = (
            (amount.gtn(0)) &&
            (recipient !== '') &&
            (durationSeconds >= secondsPerDay))
        console.log(`Valid: ${formValid}`)
        setValid(formValid)
    }, [amount, recipient, durationSeconds, secondsPerDay])

    // Calculate new duration and endTimestamp
    const onDaysChange = (ev) => {
        const newDays = ev.target.value
        let seconds = parseInt(newDays)*secondsPerDay
        if (seconds.isNaN) {
            console.log(`newDays is NAN`)
            seconds=0
        }
        console.log(`Days changed to ${newDays} (${seconds} seconds)`)
        let timestamp = dayjs().unix() + seconds
        console.log(`New endTimestamp: ${timestamp}`)
        setDurationSeconds(seconds)
        setEndTimestamp(timestamp)
    }

    const onSubmit = () => {
        // Provide stream data to createStream function for next steps
        createForm({
            token,
            amount,
            recipient,
            duration: web3.utils.toBN(durationSeconds)
        })
    }

    const onTokenSelectorChange = (token) => {
        console.log(`Token selected: ${token}`)
        setToken(token)
    }

    return (
        <Form>
            <Form.Field>
                <label>What token do you want to use?</label>
                <TokenSelector
                    availableTokens={availableTokens}
                    token={token}
                    selectToken={onTokenSelectorChange}
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
                    <Message.Item>Stream will end approximately at {dayjs.unix(endTimestamp).toString()}</Message.Item>
                    <Message.Item>{recipient} will receive {dailyRate.rounded} per day</Message.Item>
                </Message.List>
            </Message>
            <Segment basic textAlign='center'>
                <Button
                    content='Create Stream'
                    disabled={!valid}
                    positive
                    size={'big'}
                    onClick={onSubmit}
                />
                <Button
                    content='Cancel'
                    negative
                    size={'big'}
                    onClick={cancel}
                />
            </Segment>
        </Form>
    )
}

StreamForm.propTypes = {
    web3: PropTypes.object.isRequired,
    createForm: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    availableTokens: PropTypes.object.isRequired,
}

export default StreamForm