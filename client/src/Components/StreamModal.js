import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Icon, Message, Modal, Segment} from 'semantic-ui-react'
import StreamForm from './PrepareForm/StreamForm'
import CreateFormContainer from './CreateForm/CreateFormContainer'
import contract from '@truffle/contract'
import SealedSablierContractData from '../contracts/SealedSablier'
import IERC1620ContractData from '../contracts/IERC1620'
import loadTokens from '../utils/contractLoader'
import RecipientForm from './RecipientForm/RecipientForm'


const StreamModal = ({web3, open, handleClose, initialPhase}) => {
    const [account, setAccount] = useState('')
    const [sealedSablierContractInstance, setSealedSablierContractInstance] = useState()
    const [ERC1620ContractInstance, setERC1620ContractInstance] = useState()
    const [streamOptions, setStreamOptions] = useState({})
    const [phase, setPhase] = useState(initialPhase)
    const [availableTokens, setAvailableTokens] = useState({})
    const [loadingTokens, setLoadingTokens] = useState(true)
    const [loadingSablier, setLoadingSablier] = useState(true)
    const [loadingAccount, setLoadingAccount] = useState(true)
    const [loadingERC1620, setLoadingERC1620] = useState(true)

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
                setSealedSablierContractInstance(await SealedSablierContract.deployed())
                console.log("Got SealedSablier contract")
            }catch(error){
                console.log(error)
            }
            setLoadingSablier(false)
        }
        obtainTokenInstances()
        obtainSealedSablierInstance()
    }, [web3])  // should actually depend on network(ID) instead of web3 obj

    useEffect(() => {
        const obtainERC1620 = async () => {
            setLoadingERC1620(true)
            const ERC1620Contract = contract(IERC1620ContractData)
            ERC1620Contract.setProvider(web3.currentProvider)
            try {
                setERC1620ContractInstance(await ERC1620Contract.at(await sealedSablierContractInstance.Sablier()))
                console.log("Got ERC1620 contract")
            }catch(error){
                console.log(error)
            }
            setLoadingERC1620(false)
        }
        if (sealedSablierContractInstance) {
            obtainERC1620()
        }
    }, [sealedSablierContractInstance])


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
    }
    // Got ERC1620 contract?
    else if (!ERC1620ContractInstance) {
        if (loadingERC1620) {
            // still loading...
            content = <Message info icon>
                <Icon name={'spinner'} loading/>
                <Message.Content>
                    <Message.Header>Loading Sablier contract</Message.Header>
                    Please wait while loading ERC1620 Sablier contract
                </Message.Content>
            </Message>
        } else {
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
}


export default StreamModal