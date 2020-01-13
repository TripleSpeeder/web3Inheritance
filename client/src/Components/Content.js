import React from 'react'
import PropTypes from 'prop-types'
import {Header, Container, Button} from 'semantic-ui-react'
import StreamModal from './StreamModal'

const Content = ({web3}) => {
    return (
        <React.Fragment>
            <Header as='h1'>The web3 way of inheritance</Header>
            <p>Pass your heritage via Sablier streams</p>
            <StreamModal web3={web3}/>
        </React.Fragment>
    )
}

Content.propTypes = {
    web3: PropTypes.object.isRequired,
}

export default Content