import React from 'react'
import PropTypes from 'prop-types'
import {Header, List} from 'semantic-ui-react'

StreamDetails.propTypes = {
    streamId: PropTypes.string.isRequired,
    streamDetails: PropTypes.object.isRequired,
}

function StreamDetails({streamId, streamDetails}) {

    const {recipient, deposit, tokenAddress, startTime, stopTime, remainingBalance, ratePerSecond} = streamDetails

    return (
        <React.Fragment>
            <Header as='h2'>Details of stream {streamId}</Header>
            <List>
                <List.Item>Recipient: {recipient}</List.Item>
                <List.Item>Withdrawable amount: {remainingBalance.toString()} of {deposit.toString()}</List.Item>
                <List.Item>StartTime: {startTime.toString()}</List.Item>
                <List.Item>EndTime: {stopTime.toString()}</List.Item>
                <List.Item>Rate: {ratePerSecond.toString()}</List.Item>
            </List>
        </React.Fragment>
    )
}

export default StreamDetails