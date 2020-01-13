import React from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Modal} from 'semantic-ui-react'
import StreamForm from './Form/StreamForm'

const StreamModal = ({web3}) => {
    return (
        <Modal
            trigger={<Button>Setup stream</Button>}
            defaultOpen={true}
        >
            <Modal.Header>
                Set up your heritage stream
            </Modal.Header>
            <Modal.Content>
                <StreamForm web3={web3}/>
            </Modal.Content>
        </Modal>
    )
}

StreamModal.propTypes = {
    web3: PropTypes.object.isRequired,
}


export default StreamModal