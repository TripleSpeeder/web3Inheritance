import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Icon, Message, Modal, Segment} from 'semantic-ui-react'
import StreamForm from './PrepareForm/StreamForm'
import CreateFormContainer from './CreateForm/CreateFormContainer'
import contract from '@truffle/contract'
import SealedSablierContractData from '../contracts/SealedSablier'
import loadTokens from '../utils/contractLoader'


const StreamModal = ({web3, open, handleClose}) => {
    const [account, setAccount] = useState('')
    const [sealedSablierContract, setSealedSablierContract] = useState()
    const [streamOptions, setStreamOptions] = useState({})
    const [phase, setPhase] = useState(0)
    const [availableTokens, setAvailableTokens] = useState({})
    const [loadingTokens, setLoadingTokens] = useState(true)
    const [loadingSablier, setLoadingSablier] = useState(true)
    const [loadingAccount, setLoadingAccount] = useState(true)

    useEffect(() => {
        const obtainTokenInstances = async() => {
            setLoadingTokens(true)
            setAvailableTokens(await loadTokens(web3))
            setLoadingTokens(false)
        }
        const obtainSealedSablierInstance = async () => {
            setLoadingSablier(true)
            const SealedSablierContract = contract(SealedSablierContractData)
            SealedSablierContract.setProvider(web3.currentProvider)
            try {
                const instance = await SealedSablierContract.deployed()
                console.log("Got SealedSablier contract")
                setSealedSablierContract(instance)
            }catch(error){
                console.log(error)
            }
            setLoadingSablier(false)
        }
        obtainTokenInstances()
        obtainSealedSablierInstance()
    }, [web3])  // should actually depend on network(ID) instead of web3 obj

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
        setPhase(1)
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
    else if (!sealedSablierContract) {
        if (loadingSablier) {
            // still loading...
            content = <Message info icon>
                <Icon name={'spinner'} loading/>
                <Message.Content>
                    <Message.Header>Loading SealedSablier contract</Message.Header>
                    Please wait while loading SealedSablier contract
                </Message.Content>
            </Message>
        } else {
            // loading failed :-(
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
        console.warn(`SealedSablier contract has not been deployed on current network`)
    }
    // Got Token contract(s)?
    else if (!Object.keys(availableTokens).length) {
        if (loadingTokens) {
            // still loading...
            content = <Message info icon>
                <Icon name={'spinner'} loading/>
                <Message.Content>
                    <Message.Header>Loading token contracts</Message.Header>
                    Please wait while loading token contracts
                </Message.Content>
            </Message>
        } else {
            // loading failed :-(
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
    }
    else if (phase===0) {
        content = <StreamForm
            web3={web3}
            createForm={onCreateStream}
            cancel={handleClose}
            availableTokens={availableTokens}
            account={account}
        />
    }
    else if (phase === 1) {
        content = <CreateFormContainer
            web3={web3}
            token={streamOptions.token}
            sender={account}
            sealedSablierInstance={sealedSablierContract}
            amount={streamOptions.amount}
            recipient={streamOptions.recipient}
            duration={streamOptions.duration}
            cancel={()=>{setPhase(0)}}
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
}


export default StreamModal