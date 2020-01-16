import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Input, Message, Segment} from 'semantic-ui-react'
import TokenSelector from './TokenSelector'
import AmountInputContainer from './AmountInputContainer'
import AddressInputContainer from './AddressInputContainer'
import bnToDisplayString from '@triplespeeder/bn2string'
import dayjs from 'dayjs'
import DurationInput from './DurationInput'


const StreamForm = ({web3, createForm, cancel, availableTokens, account}) => {

    const secondsPerDay = 24*60*60

    const [token, setToken] = useState()
    const [amount, setAmount] = useState(web3.utils.toBN(0))
    const [recipient, setRecipient] = useState('')
    const [durationSeconds, setDurationSeconds] = useState(web3.utils.toBN(0))
    const [valid, setValid] = useState(false)
    const [endTimestamp, setEndTimestamp] = useState()
    const [dailyRate, setDailyRate] = useState({precise: '', rounded: '', amount:web3.utils.toBN(0)})

    // calculate daily rate when token, amount or duration changes
    useEffect(() => {
        const calcRate = () => {
            let amountPerSecond = amount.div(web3.utils.toBN(durationSeconds))
            let amountPerDay = amountPerSecond.mul(web3.utils.toBN(secondsPerDay))
            let {precise, rounded} = bnToDisplayString({
                value: amountPerDay,
                decimals: token.decimals,
                roundToDecimals: web3.utils.toBN(3)
            })
            setDailyRate({precise, rounded, amount: amountPerDay})
        }
        if (token && token.decimals && amount.gt(0) && (durationSeconds>0)){
            calcRate()
        }
    }, [amount, durationSeconds, token])

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
    const onDurationChange = (duration) => {
        let timestamp = dayjs().unix() + duration
        console.log(`New endTimestamp: ${timestamp}`)
        setDurationSeconds(duration)
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

    let summaryContent
    if (valid) {
        summaryContent = <Message.List>
            <Message.Item>Stream will end approximately at {dayjs.unix(endTimestamp).toString()}</Message.Item>
            <Message.Item>{recipient} will receive {dailyRate.rounded} {token.symbol} per day</Message.Item>
        </Message.List>
    } else {
        summaryContent = <p>
            Summary will update when all fields are filled.
        </p>
    }

    return (
        <Form size={'big'}>
            <TokenSelector
                availableTokens={availableTokens}
                token={token}
                selectToken={onTokenSelectorChange}/>
            <AmountInputContainer
                web3={web3}
                amount={amount}
                setAmount={setAmount}
                token={token}
                account={account}/>
            <AddressInputContainer
                setAddress={setRecipient}
                web3={web3}/>
            <DurationInput
                handleDuration={onDurationChange}/>
            <Message>
                <Message.Header>Summary</Message.Header>
                {summaryContent}
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
    account: PropTypes.string.isRequired,
}

export default StreamForm