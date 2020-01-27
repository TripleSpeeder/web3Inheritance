import React from 'react'
import PropTypes from 'prop-types'
import {Button, Icon, Message, Modal} from 'semantic-ui-react'
import bnToDisplayString from '@triplespeeder/bn2string'
import {Link} from 'react-router-dom'
import StreamProgress from './StreamProgress'
import BalanceProgress from './BalanceProgress'

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

    let modalContent
    if (loading) {
        modalContent = <Message icon info size={'big'}>
            <Icon loading name={'spinner'}/>
            <Message.Content>
                <Message.Header>Loading stream</Message.Header>
                <p>Please wait while loading streamdetails...</p>
            </Message.Content>
        </Message>
    } else if (!streamDetails) {
        modalContent = <Message icon error size={'big'}>
            <Icon name={'exclamation'}/>
            <Message.Content>
                <Message.Header>Error loading stream details</Message.Header>
                <p>Could not load stream details.</p>
            </Message.Content>
        </Message>
    } else {
        const {deposit, startTime, stopTime, remainingBalance, recipientBalance} = streamDetails

        let withdrawButton
        if (withdrawing) {
            withdrawButton = <Button positive icon size={'big'} disabled>
                <Icon loading name={'spinner'}/>
                Withdrawal confirming...
            </Button>
        } else {
            let {rounded} = bnToDisplayString({
                value: recipientBalance,
                decimals: token.decimals,
                roundToDecimals: web3.utils.toBN(2)
            })
            withdrawButton = <Button positive size={'big'} onClick={withdraw}>Withdraw {rounded} {token.symbol}</Button>
        }
        const isRecipient = (account === streamDetails.recipient)

        modalContent = <React.Fragment>
            <StreamProgress
                startTimestamp={startTime.toNumber()}
                stopTimestamp={stopTime.toNumber()}
            />
            <BalanceProgress
                recipientBalance={recipientBalance}
                token={token}
                BN={web3.utils.BN}
                remainingBalance={remainingBalance}
                deposit={deposit}
            />
            {isRecipient && <p>{withdrawButton}</p>}
        </React.Fragment>
    }

    return <Modal open={true}>
        <Modal.Header>Stream {streamId} details</Modal.Header>
        <Modal.Content>
            {modalContent}
        </Modal.Content>
        <Modal.Actions>
            <Button as={Link} to={'/'}>
                <Icon name='checkmark' /> Close
            </Button>
        </Modal.Actions>
    </Modal>

}

export default StreamDetails
