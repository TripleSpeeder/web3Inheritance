import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {
    useParams
} from "react-router-dom";
import {Message} from 'semantic-ui-react'
import StreamDetails from './StreamDetails'

StreamDetailsContainer.propTypes = {
    ERC1620Instance: PropTypes.object.isRequired
}

function StreamDetailsContainer({ERC1620Instance}) {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    const { streamId } = useParams();
    const [loadingDetails, setLoadingDetails] = useState(true)
    const [streamDetails, setStreamDetails] = useState()

    useEffect(() => {
        const loadStreamDetails = async () => {
            setLoadingDetails(true)
            console.log(`Loading details for streamId ${streamId}...`)
            try {
                let result = await ERC1620Instance.getStream(streamId)
                console.log(result)
                setStreamDetails(result)
            }catch (e) {
                console.log(`Failed to obtain stream details: ${e}`)
                setStreamDetails(undefined)
            }
            setLoadingDetails(false)
        }
        if (ERC1620Instance && streamId) {
            loadStreamDetails()
        }
    }, [streamId, ERC1620Instance])

    if (loadingDetails) {
        return <Message>
            <Message.Header>Loading stream</Message.Header>
            <p>Please wait while loading streamdetails...</p>
        </Message>
    }

    if (!streamDetails) {
        return <Message error>
            <Message.Header>Error loading stream details</Message.Header>
            <p>Could not load stream details.</p>
        </Message>
    }

    return (
        <StreamDetails
            streamId={streamId}
            streamDetails={streamDetails}
        />
    )
}

export default StreamDetailsContainer