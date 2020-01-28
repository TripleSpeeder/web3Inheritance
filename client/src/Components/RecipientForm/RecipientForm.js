import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Icon, List, Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'


RecipientForm.propTypes = {
    account: PropTypes.string.isRequired,
    sealedSablierInstance: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired,
}

function RecipientForm({account, sealedSablierInstance, goBack}) {

    const [loadingEvents, setLoadingEvents] = useState(true)
    const [myStreams, setMyStreams] = useState([])

    useEffect(() => {
        const loadEvents = async () => {
            setLoadingEvents(true)
            let createEvents = await sealedSablierInstance.getPastEvents('CreateSealedStream', {
                fromBlock: 1,
                filter: {
                    recipient: account
                }
            })
            console.log(createEvents)
            let streamArray = createEvents.map(event => (
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
            setMyStreams(streamArray)
            setLoadingEvents(false)
        }
        loadEvents()
    }, [sealedSablierInstance, account])

    let content
    if (loadingEvents) {
        content =  <Message icon info size={'big'}>
            <Icon loading name='spinner'/>
            <Message.Content>
                <Message.Header>Loading incoming streams</Message.Header>
                Please wait while loading your incoming streams
            </Message.Content>
        </Message>
    }else if (myStreams.length === 0) {
        content = <Message info size={'big'}>
            <Message.Content>
                You don't have any incoming heritage streams.
            </Message.Content>
        </Message>
    } else {
        let listItems = myStreams.map((stream) => (
            <List.Item key={stream.streamID}>
                <Button as={Link} to={`/streams/${stream.streamID}`}>{stream.streamID}</Button> from {stream.sender}
            </List.Item>
        ))
        content = <List>{listItems}</List>
    }
    return (
        <React.Fragment>
            {content}
            <Button onClick={goBack}>Back</Button>
        </React.Fragment>
    )
}

export default RecipientForm