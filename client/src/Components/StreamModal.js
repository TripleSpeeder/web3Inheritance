import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Form, Modal, Segment} from 'semantic-ui-react'
import StreamForm from './PrepareForm/StreamForm'
import CreateFormContainer from './CreateForm/CreateFormContainer'
import contract from '@truffle/contract'
import ERC20MockContractData from '../contracts/ERC20Mock'
import SealedSablierContractData from '../contracts/SealedSablier'
import loadTokens from '../utils/contractLoader'


const StreamModal = ({web3}) => {
    const [account, setAccount] = useState('')
    const [tokenContract, setTokenContract] = useState()
    const [sealedSablierContract, setSealedSablierContract] = useState()
    const [streamOptions, setStreamOptions] = useState({})
    const [phase, setPhase] = useState(0)
    const [open, setOpen] = useState(false)
    const [availableTokens, setAvailableTokens] = useState({})

    useEffect(() => {
        const obtainAccount = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0])
            console.log("Got accounts")
        }/*
        const obtainTokenInstance = async () => {
            // Get the contract instance.
            const ERC20Contract = contract(ERC20MockContractData)
            ERC20Contract.setProvider(web3.currentProvider)
            const instance = await ERC20Contract.deployed()
            console.log("Got tokenContract")
            setTokenContract(instance)
        }
        */
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
        obtainAccount()
        obtainTokenInstances()
        obtainSealedSablierInstance()
    }, [web3])

    if (account === '') {
        return <Segment>Waiting for web3 account...</Segment>
    }
    if (!Object.keys(availableTokens).length) {
        return <Segment>Waiting for token contract instances...</Segment>
    }
    if (!sealedSablierContract) {
        // return <Segment>Waiting for SealedSablier contract instance...</Segment>
        console.warn(`SealedSablier contract has not been deployed on current network`)
    }

    const onCreateStream = (streamOptions) => {
        console.log("Got streamOptions")
        console.log(streamOptions)
        setStreamOptions(streamOptions)
        setPhase(1)
    }

    const handleClose = () => {
        setOpen(false)
        setPhase(0)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    let content
    if (phase===0) {
        content = <StreamForm
            web3={web3}
            createForm={onCreateStream}
            cancel={handleClose}
            availableTokens={availableTokens}
        />
    }else if(phase === 1) {
        content = <CreateFormContainer
            web3={web3}
            tokenInstance={streamOptions.token.contractInstance}
            sender={account}
            sealedSablierInstance={sealedSablierContract}
            amount={streamOptions.amount}
            recipient={streamOptions.recipient}
            duration={streamOptions.duration}
            cancel={handleClose}
        />
    }
    return (
        <Modal
            trigger={<Button onClick={handleOpen}>Setup stream</Button>}
            open={open}
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
}


export default StreamModal