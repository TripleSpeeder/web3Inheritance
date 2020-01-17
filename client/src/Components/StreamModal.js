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

    useEffect(() => {
        const obtainTokenInstances = async() => {
            setAvailableTokens(await loadTokens(web3))
        }
        const obtainSealedSablierInstance = async () => {
            // Get the contract instance.
            const SealedSablierContract = contract(SealedSablierContractData)
            SealedSablierContract.setProvider(web3.currentProvider)
            try {
                const instance = await SealedSablierContract.deployed()
                console.log("Got SealedSablier contract")
                setSealedSablierContract(instance)
            }catch(error){
                console.log(error)
            }
        }
        obtainTokenInstances()
        obtainSealedSablierInstance()
    }, [web3])  // should actually depend on network(ID) instead of web3 obj

    useEffect(() => {
        const obtainAccount = async () => {
            try {
                // Request account access
                await window.ethereum.enable();
                // Acccounts now exposed
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0])
                console.log("Got account")
            } catch (error) {
                console.log('User rejected connection request')
                handleClose()
            }
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

    if (!sealedSablierContract) {
        // return <Segment>Waiting for SealedSablier contract instance...</Segment>
        console.warn(`SealedSablier contract has not been deployed on current network`)
    }

    if (account === '') {
        console.log("Still waiting for account...")
        content = <Message info icon header='please connect wallet'>
            <Icon name={'info'}/>
            Please approve connection to your account to continue
        </Message>
    }
    else if (!Object.keys(availableTokens).length) {
        content = <Message info icon header='Loading token contracts'>
            <Icon name={'spinner'} loading/>
            Please wait while loading token contracts
        </Message>
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
            tokenInstance={streamOptions.token.contractInstance}
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