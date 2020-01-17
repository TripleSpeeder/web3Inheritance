import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Container, Grid, Header, Icon, Menu, Segment} from 'semantic-ui-react'
import StreamModal from './Components/StreamModal'

MainPage.propTypes = {
    web3: PropTypes.object.isRequired,
}

function MainPage({web3}) {

    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const HomepageHeading =
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
                    /* marginBottom: 0,*/
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
            <Button primary size='huge' onClick={()=>{setOpen(true)}}>
                Setup Stream
                <Icon name='right arrow' />
            </Button>
        </Container>

    const TopMenu =
        <Segment inverted textAlign={'center'} vertical>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item as='a' header>
                        Digital Heritage powered by Sablier
                    </Menu.Item>
                </Container>
            </Menu>
            {HomepageHeading}
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
                    <Grid.Column floated='right' width={6}>
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
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <Button size='huge'>Check Them Out</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>

    return (
        <React.Fragment>
            {TopMenu}
            {Explainer}
            {open && <StreamModal open={open} handleClose={handleClose} web3={web3}/>}
        </React.Fragment>
    )
}

export default MainPage