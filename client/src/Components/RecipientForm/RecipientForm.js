import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {topicHash, eventABI} from '../../utils/streamEventsABI'
import {Button} from 'semantic-ui-react'


RecipientForm.propTypes = {
    account: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
    ERC1620Instance: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired,
}

function RecipientForm({web3, account, ERC1620Instance, goBack}) {

    const [loadingEvents, setLoadingEvents] = useState(true)
    const [myStreams, setMyStreams] = useState({})

    useEffect(() => {
        const loadEvents = async () => {
            setLoadingEvents(true)
            let createEvents = await ERC1620Instance.getPastEvents('CreateStream', {
                fromBlock: 1,
                filter: {
                    recipient: account
                }
            })
            console.log(createEvents)
            setLoadingEvents(false)
        }
        loadEvents()
    }, [ERC1620Instance, account])

    return (
        <React.Fragment>
            <div>List all incoming streams here</div>
            <Button onClick={goBack}>Back</Button>
        </React.Fragment>
    )
}

export default RecipientForm