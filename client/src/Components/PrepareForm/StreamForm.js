import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Grid, Message} from 'semantic-ui-react'
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
    const [durationSeconds, setDurationSeconds] = useState(0)
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
        if (token && token.decimals && amount.gt(0) && (durationSeconds)){
            calcRate()
        }
    }, [amount, durationSeconds, token, web3, secondsPerDay])

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
            <Message.Item>Stream end: {dayjs.unix(endTimestamp).format('YYYY-MM-DD HH:mm')}</Message.Item>
            <Message.Item>Daily rate: {dailyRate.rounded} {token.symbol}</Message.Item>
        </Message.List>
    } else {
        summaryContent = <p>
            Summary will update when all fields are filled.
        </p>
    }

    return (
        <Grid columns={2} divided>
            <Grid.Row>
                <Grid.Column width={8}>
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
                    </Form>
                </Grid.Column>
                <Grid.Column width={8} verticalAlign={'middle'}>
                    <Message info size={'big'}>
                        <Message.Header>Summary</Message.Header>
                        {summaryContent}
                    </Message>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign={'justified'}>
                <Grid.Column width={4}>
                    <Button
                        fluid
                        content='Create Stream'
                        disabled={!valid}
                        positive
                        size={'big'}
                        onClick={onSubmit}
                    />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Button
                        fluid
                        content='Cancel'
                        negative
                        size={'big'}
                        onClick={cancel}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
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