import React from 'react'
import PropTypes from 'prop-types'
import {Button, List, Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

StreamList.propTypes = {
    streams: PropTypes.array.isRequired,
    incoming: PropTypes.bool.isRequired,
}

function StreamList({streams, incoming}) {
    if (incoming) {
        if (streams.length > 0) {
            // got incoming streams
            let listItems = streams.map((stream) => (
                <List.Item key={stream.streamID}>
                    <Button as={Link} to={`/streams/${stream.streamID}`}>{stream.streamID}</Button> from {stream.sender}
                </List.Item>
            ))
            return <List>{listItems}</List>
        } else {
            // no incoming streams
            return <Message info size={'big'}>
                <Message.Content>
                    You don't have any incoming heritage streams.
                </Message.Content>
            </Message>
        }
    } else {
        if (streams.length > 0) {
            // got outgoing streams
            let listItems = streams.map((stream) => (
                <List.Item key={stream.streamID}>
                    <Button as={Link} to={`/streams/${stream.streamID}`}>{stream.streamID}</Button> to {stream.recipient}
                </List.Item>
            ))
            return <List>{listItems}</List>
        } else {
            // no outgoing streams
            return <Message info size={'big'}>
                <Message.Content>
                    You don't have any outgoing heritage streams.
                </Message.Content>
            </Message>
        }
    }
}

export default StreamList