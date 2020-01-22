import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Container, Grid, Header, Icon, Message, Segment} from 'semantic-ui-react'
import StreamModal from './Components/StreamModal'

MainPage.propTypes = {
    web3: PropTypes.object,
    sealedSablierContractInstance: PropTypes.object,
    ERC1620ContractInstance: PropTypes.object,
    availableTokens: PropTypes.object,
}

function MainPage({web3, sealedSablierContractInstance, ERC1620ContractInstance, availableTokens}) {

    const [open, setOpen] = useState(0)

    const ready = (web3 && sealedSablierContractInstance && ERC1620ContractInstance && Object.keys(availableTokens).length)

    const handleClose = () => {
        setOpen(0)
    }

    let Actions
    if (ready) {
        Actions =<React.Fragment>
            <Button primary size='massive' onClick={()=>{setOpen(1)}}>
                Create new stream
                <Icon name='right arrow' />
            </Button>
            <Button primary size='massive' onClick={()=>{setOpen(3)}}>
                Show incoming streams
                <Icon name='right arrow' />
            </Button>
        </React.Fragment>
    } else {
        Actions = <Message icon info size={'big'}>
            <Icon loading name='spinner'/>
            <Message.Content>
                <Message.Header>Initializing backend</Message.Header>
                Please wait while loading contracts
            </Message.Content>
        </Message>
    }

    const HomepageHeading =
        <Segment inverted textAlign={'center'} vertical>
            <Container
                text
                style={{marginBottom: '2em'}}
            >
                <Header
                    as='h1'
                    content='The web3 way of inheritance'
                    inverted
                    style={{
                        fontSize: '4em',
                        fontWeight: 'normal',
                        marginTop: '3em',
                    }}
                />
                <Header
                    as='h2'
                    content='secure. unstoppable. responsible.'
                    subheader='Pass your heritage via Sablier streams'
                    inverted
                    style={{
                        fontSize: '1.7em',
                        fontWeight: 'normal',
                        marginTop: '1.5em',
                    }}
                />
                {Actions}
            </Container>
        </Segment>

    const Explainer =
        <Segment style={{ padding: '8em 0em' }} vertical>
            <Grid container stackable verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            Are you hesitating to inherit all your wealth at once?
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Do you prefer to make your heritage a constant stream of income for an
                            extended period of time? Setting this up is a cumbersome process involving lawyers,
                            banks and notaries. And they all will request a substantial amount of money
                            for their service!
                        </p>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            Stop looking!
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Now you can set up a streaming inheritance in less than 2
                            minutes. No paperwork, no KYC. Secured by Sablier on the Ethereum Blockchain.
                        </p>
                    </Grid.Column>
                    <Grid.Column floated='right' width={7}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            How does it work?
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Web3Inheritance is a proxy for creating Sablier streams. The difference to a
                            normal Sablier stream is that nobody has control on the stream once it is created.
                            Effectively the money is locked into the Sablier stream, with the owner being the
                            SealedSablier smart contract.</p>
                        <p style={{ fontSize: '1.33em' }}>This means that only the receiver can interact
                            with the stream. Once set up, there is no way for you to modify or cancel the
                            heritage stream - Your decision is final.
                        </p>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            More information
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            For more information about Sablier streams check out the official site
                            at <a href={'https://sablier.finance'}>sablier.finance</a>.
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>

    return (
        <React.Fragment>
            {HomepageHeading}
            {Explainer}
            {open && <StreamModal
                open={true}
                handleClose={handleClose}
                web3={web3}
                initialPhase={open}
                sealedSablierContractInstance={sealedSablierContractInstance}
                ERC1620ContractInstance={ERC1620ContractInstance}
                availableTokens={availableTokens}
            />}
        </React.Fragment>
    )
}

export default MainPage