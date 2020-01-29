import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Header, Icon, Message} from 'semantic-ui-react'
import StreamList from './StreamList'


StreamListController.propTypes = {
    account: PropTypes.string.isRequired,
    sealedSablierInstance: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired,
}

function StreamListController({account, sealedSablierInstance, goBack}) {

    const [loadingEvents, setLoadingEvents] = useState(true)
    const [incomingStreams, setIncomingStreams] = useState([])
    const [outgoingStreams, setOutgoingStreams] = useState([])

    useEffect(() => {
        const loadEvents = async () => {
            setLoadingEvents(true)
            let [incomingEvents, outgoingEvents] = await Promise.all([
                sealedSablierInstance.getPastEvents('CreateSealedStream', {
                    fromBlock: 1,
                    filter: {
                        recipient: account
                    }
                }),
                sealedSablierInstance.getPastEvents('CreateSealedStream', {
                    fromBlock: 1,
                    filter: {
                        sender: account
                    }
                })
            ])

            console.log(`Incoming: ${incomingEvents}`)
            console.log(`Outgoing: ${outgoingEvents}`)
            let incomingArray = incomingEvents.map(event => (
                {
                    streamID: event.returnValues.streamId,
                    sender: event.returnValues.sender,
                    recipient: event.returnValues.recipient,
                    deposit: event.returnValues.deposit,
                    startTime: event.returnValues.startTime,
                    stopTime: event.returnValues.stopTime,
                    tokenAddress: event.returnValues.tokenAddress
                }
            ))
            setIncomingStreams(incomingArray)
            let outgoingArray = outgoingEvents.map(event => (
                {
                    streamID: event.returnValues.streamId,
                    sender: event.returnValues.sender,
                    recipient: event.returnValues.recipient,
                    deposit: event.returnValues.deposit,
                    startTime: event.returnValues.startTime,
                    stopTime: event.returnValues.stopTime,
                    tokenAddress: event.returnValues.tokenAddress
                }
            ))
            setOutgoingStreams(outgoingArray)
            setLoadingEvents(false)
        }
        loadEvents()
    }, [sealedSablierInstance, account])

    if (loadingEvents) {
        return <Message icon info size={'big'}>
            <Icon loading name='spinner'/>
            <Message.Content>
                <Message.Header>Loading streams</Message.Header>
                Please wait while loading your streams
            </Message.Content>
        </Message>
    }

    return (
        <React.Fragment>
            <Header as='h2'>Incoming streams</Header>
            <StreamList streams={incomingStreams} incoming={true}/>
            <Header as='h2'>Outgoing streams</Header>
            <StreamList streams={outgoingStreams} incoming={false}/>
            <Button onClick={goBack}>Back</Button>
        </React.Fragment>
    )
}

export default StreamListController