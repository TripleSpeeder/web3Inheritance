import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Icon, Message, Modal} from 'semantic-ui-react'
import StreamForm from './PrepareForm/StreamForm'
import CreateFormContainer from './CreateForm/CreateFormContainer'
import RecipientForm from './RecipientForm/RecipientForm'


const StreamModal = ({web3, open, handleClose, initialPhase, sealedSablierContractInstance, ERC1620ContractInstance, availableTokens}) => {
    const [account, setAccount] = useState('')
    const [streamOptions, setStreamOptions] = useState({})
    const [phase, setPhase] = useState(initialPhase)
    const [loadingAccount, setLoadingAccount] = useState(true)

    useEffect(() => {
        const obtainAccount = async () => {
            setLoadingAccount(true)
            try {
                // Request account access
                await window.ethereum.enable();
                // Acccounts now exposed
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0])
                console.log("Got account")
            } catch (error) {
                console.log('User rejected connection request')
            }
            setLoadingAccount(false)
        }
        if(open) {
            obtainAccount()
        }
    }, [open, web3]) // should actually depend on network(ID) instead of web3 obj

    const onCreateStream = (streamOptions) => {
        console.log("Got streamOptions")
        console.log(streamOptions)
        setStreamOptions(streamOptions)
        setPhase(2)
    }

    let content

    // Got account?
    if (account === '') {
        if (loadingAccount) {
            console.log("Still waiting for account...")
            content = <Message info icon>
                <Icon name={'spinner'} loading/>
                <Message.Content>
                    <Message.Header>Connect wallet</Message.Header>
                    Please approve connection to your account to continue
                </Message.Content>
            </Message>
        } else {
            content = <Message error icon>
                <Icon name={'exclamation'}/>
                <Message.Content>
                    <Message.Header>Could not connect account</Message.Header>
                    <p>You need to approve the account connection in order to setup a stream.</p>
                    <Button color={'black'} onClick={handleClose}>Okay</Button>
                </Message.Content>
            </Message>

        }
    }
    // Got SealedSablier contract?
    else if (!sealedSablierContractInstance) {
        content = <Message error icon>
            <Icon name={'exclamation'}/>
            <Message.Content>
                <Message.Header>Could not load SealedSablier contract</Message.Header>
                <p>
                    Are you running on a local dev chain? Make sure to execute <em>truffle
                    migrate</em> to deploy instances of Sablier and SealedSablier contracts.
                </p>
                <Button color={'black'} onClick={handleClose}>Okay</Button>
            </Message.Content>
        </Message>
    }
    // Got ERC1620 contract?
    else if (!ERC1620ContractInstance) {
        // loading failed :-(
        content = <Message error icon>
            <Icon name={'exclamation'}/>
            <Message.Content>
                <Message.Header>Could not load Sablier contract</Message.Header>
                <p>
                    Are you running on a local dev chain? Make sure to execute <em>truffle
                    migrate</em> to deploy Sablier ERC1620 contracts.
                </p>
                <Button color={'black'} onClick={handleClose}>Okay</Button>
            </Message.Content>
        </Message>
    }
    // Got Token contract(s)?
    else if (!Object.keys(availableTokens).length) {
        content = <Message error icon>
            <Icon name={'exclamation'}/>
            <Message.Content>
                <Message.Header>No token contracts available</Message.Header>
                <p>Are you running on a local dev chain? Make sure to execute <em>truffle
                    migrate</em> to deploy an ERC20 Mock contract.</p>
                <Button color={'black'} onClick={handleClose}>Okay</Button>
            </Message.Content>
        </Message>
    }
    else if (phase===1) {
        content = <StreamForm
            web3={web3}
            createForm={onCreateStream}
            cancel={handleClose}
            availableTokens={availableTokens}
            account={account}
        />
    }
    else if (phase === 2) {
        content = <CreateFormContainer
            web3={web3}
            token={streamOptions.token}
            sender={account}
            sealedSablierInstance={sealedSablierContractInstance}
            amount={streamOptions.amount}
            recipient={streamOptions.recipient}
            duration={streamOptions.duration}
            cancel={()=>{setPhase(1)}}
            closeModal={handleClose}
        />
    }
    else if (phase === 3) {
        content = <RecipientForm
            account={account}
            web3={web3}
            ERC1620Instance={ERC1620ContractInstance}
            goBack={handleClose}
        />
    }

    return (
        <Modal
            open={open}
            size={'large'}
        >
            <Modal.Header>
                Set up your heritage stream
            </Modal.Header>
            <Modal.Content>
                {content}
            </Modal.Content>
        </Modal>
    )
}

StreamModal.propTypes = {
    web3: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    initialPhase: PropTypes.number,
    sealedSablierContractInstance: PropTypes.object,
    ERC1620ContractInstance: PropTypes.object,
    availableTokens: PropTypes.object,
}


export default StreamModal