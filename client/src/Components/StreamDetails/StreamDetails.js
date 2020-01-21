import React from 'react'
import PropTypes from 'prop-types'
import {Button, Header, Icon, List, Message, Progress} from 'semantic-ui-react'
import dayjs from 'dayjs'
import bnToDisplayString from '@triplespeeder/bn2string'

StreamDetails.propTypes = {
    loading: PropTypes.bool.isRequired,
    streamId: PropTypes.string.isRequired,
    streamDetails: PropTypes.object.isRequired,
    web3: PropTypes.object.isRequired,
    withdrawing: PropTypes.bool.isRequired,
    withdraw: PropTypes.func.isRequired,
    account: PropTypes.string.isRequired,
    token: PropTypes.object.isRequired,
}

function StreamDetails({loading, streamId, streamDetails, web3, withdraw, withdrawing, account, token}) {

    if (loading) {
        return <Message icon info size={'big'}>
            <Icon loading name={'spinner'}/>
            <Message.Content>
                <Message.Header>Loading stream</Message.Header>
                <p>Please wait while loading streamdetails...</p>
            </Message.Content>
        </Message>
    }

    if (!streamDetails) {
        return <Message icon error size={'big'}>
            <Icon name={'exclamation'}/>
            <Message.Content>
                <Message.Header>Error loading stream details</Message.Header>
                <p>Could not load stream details.</p>
            </Message.Content>
        </Message>
    }

    const {recipient, deposit, tokenAddress, startTime, stopTime, remainingBalance, ratePerSecond, recipientBalance} = streamDetails

    // calculate time progress
    const now = web3.utils.toBN(dayjs().unix())
    const duration = stopTime.sub(startTime)
    const elapsed = now.sub(startTime)
    const remainingTime = stopTime.sub(now)
    let progressPercent
    let active
    if (elapsed.ltn(0)) {
        // stream did not yet start
        progressPercent = 0
        active = false
    }else if (elapsed.gt(duration)) {
        // stream has ended
        progressPercent = 100
        active = false
    } else {
        progressPercent = elapsed.muln(100).div(duration).toNumber()
        active = true
    }
    console.log(`Duration: ${duration.toString()}, Elapsed: ${elapsed.toString()} ( ${progressPercent.toString()}%)`)

    // calculate balance progress (How many funds are already *withdrawn* vs total deposit)
    let withDrawnAmount = deposit.sub(remainingBalance)
    let balancePercent
    if (withDrawnAmount.isZero()) {
        balancePercent = web3.utils.toBN(0)
    } else if (withDrawnAmount.eq(deposit)) {
        balancePercent = web3.utils.toBN(100)
    } else {
        balancePercent = withDrawnAmount.muln(100).div(deposit)
    }
    console.log(balancePercent)
    console.log(`Deposit: ${deposit.toString()}, Withdrawn: ${withDrawnAmount.toString()} (${balancePercent.toString()}%)`)

    let withdrawButton
    if (withdrawing) {
        withdrawButton = <Button disabled>withdrawing...</Button>
    } else {
        let {precise, rounded} = bnToDisplayString({value: recipientBalance, decimals: token.decimals, roundToDecimals: web3.utils.toBN(2)})
        withdrawButton = <Button onClick={withdraw}>Withdraw {rounded} {token.symbol}</Button>
    }
    const isRecipient = (account === streamDetails.recipient)

    return (
        <React.Fragment>
            <Header as='h2'>Details of stream {streamId}</Header>
            <List>
                <List.Item>Recipient: {recipient}</List.Item>
                <List.Item>Withdrawable amount: {recipientBalance.toString()}</List.Item>
                <List.Item>Remainaing balance: {remainingBalance.toString()} of {deposit.toString()}</List.Item>
                <List.Item>StartTime: {startTime.toString()}</List.Item>
                <List.Item>EndTime: {stopTime.toString()}</List.Item>
                <List.Item>Rate: {ratePerSecond.toString()}</List.Item>
            </List>
            <Progress percent={progressPercent} progress active={active}>{remainingTime.toString()} seconds left</Progress>
            <Progress percent={balancePercent} progress>{remainingBalance.toString()} still locked</Progress>
            {isRecipient && withdrawButton}
        </React.Fragment>
    )
}

export default StreamDetails