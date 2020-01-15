import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'semantic-ui-react'
import dayjs from 'dayjs'
import CreateForm from './CreateForm'

export const createFormStates = {
    CREATE_FORM_STATE_ERROR: 0,
    CREATE_FORM_STATE_CHECKING_BALANCE: 10,
    CREATE_FORM_STATE_CHECKING_ALLOWANCE: 20,
    CREATE_FORM_STATE_WAITING_ALLOWANCE: 30,
    CREATE_FORM_STATE_WAITING_STREAM: 40,
    CREATE_FORM_STATE_FINISHED: 50
}

const CreateFormContainer = ({web3, sender, tokenInstance, amount, sealedSablierInstance, recipient, duration, cancel}) => {

    // Constants to find & decode CreateStream event
    const topicHash = web3.utils.keccak256("CreateStream(uint256,address,address,uint256,address,uint256,uint256)")
    const eventABI = [
        {
            "indexed": true,
            "internalType": "uint256",
            "name": "streamId",
            "type": "uint256"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "deposit",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "stopTime",
            "type": "uint256"
        }
    ]

    const [streamId, setStreamId] = useState(0)
    const [error, setError] = useState('')
    const [formState, setFormState] = useState(createFormStates.CREATE_FORM_STATE_CHECKING_BALANCE)

    // Transform duration to startTime and stopTime
    const calcTimeStamps = () => {
        // add 5 minutes offset to startTime to make sure stream is fully created before startTime reached
        let startTime = web3.utils.toBN(dayjs().unix() + (5*60))
        return {
            startTime,
            stopTime: startTime.add(duration)
        }
    }

    // Sablier requires amount to be multiple of duration. Decrease effective amount accordingly
    const calcFinalAmount = () => {
        let remainder = amount.mod(duration)
        return amount.sub(remainder)
    }


    // simplified state machine to track creation process.
    // I'm sure there exists a hooks-based statemachine library somewhere I could use instead :)
    useEffect(() => {
        const checkBalance = async () => {
            console.log('Checking Balance')
            setError('')
            let balance
            try {
                balance = await tokenInstance.balanceOf(sender)
            } catch(error) {
                console.log("Error getting balance")
                setError(`Error getting balance: ${error.code} - ${error.message}`)
                setFormState(createFormStates.CREATE_FORM_STATE_ERROR)
            }
            if (balance.gte(amount)){
                setFormState(createFormStates.CREATE_FORM_STATE_CHECKING_ALLOWANCE)
            } else {
                setError(`Not enough funds. Required: ${amount.toString()} Available: ${balance.toString()}`)
                setFormState(createFormStates.CREATE_FORM_STATE_ERROR)
            }
        }
        const checkAllowance = async() => {
            console.log("checking allowance")
            setError('')
            let allowance = await tokenInstance.allowance(sender, sealedSablierInstance.address)
            if (allowance.gte(amount)){
                setFormState(createFormStates.CREATE_FORM_STATE_WAITING_STREAM)
            } else {
                setError(`Not enough allowance. Required: ${amount.toString()} Available: ${allowance.toString()}`)
                setFormState(createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE)
            }
        }
        const setAllowance = async () => {
            console.log(`Setting allowance of ${amount.toString()}`)
            setError('')
            try {
                let result = await tokenInstance.approve(sealedSablierInstance.address, amount.toString(), {from: sender})
                setFormState(createFormStates.CREATE_FORM_STATE_WAITING_STREAM)
            } catch(error) {
                console.log("Error while approving")
                setError(`Error getting balance: ${error.code} - ${error.message}`)
                setFormState(createFormStates.CREATE_FORM_STATE_ERROR)
            }
        }
        const createStream = async() => {
            console.log(`Creating stream`)
            setError('')
            const finalAmount = calcFinalAmount()
            console.log(`Effective amount: ${finalAmount} (requested: ${amount})`)
            const timeStamps = calcTimeStamps()
            try {
                let result = await sealedSablierInstance.createStream(recipient, finalAmount.toString(), tokenInstance.address, timeStamps.startTime.toString(), timeStamps.stopTime.toString(), {from: sender})
                // Get CreateStream event to verify results. Since the event is not created by SealedSablier, but by the
                // external "Sablier" contract, we have to manually look for it by topicHash in tx.rawLogs
                let event = result.receipt.rawLogs.find(log => {
                    return (log.topics[0] === topicHash)
                });
                // skip event.topics[0] while decoding as it contains the topicHash
                let decoded = web3.eth.abi.decodeLog(eventABI, event.data, event.topics.slice(1))
                console.log(decoded)
                setStreamId(parseInt(decoded.streamId))
                setFormState(createFormStates.CREATE_FORM_STATE_FINISHED)
            } catch(error){
                console.log("Error while creating stream")
                setError(`Error while creating stream: ${error.code} - ${error.message}`)
                setFormState(createFormStates.CREATE_FORM_STATE_ERROR)
            }
        }
        console.log(`CreateForm web3 version: ${web3.version}`)
        switch(formState) {
            case createFormStates.CREATE_FORM_STATE_CHECKING_BALANCE:
                checkBalance()
                break
            case createFormStates.CREATE_FORM_STATE_CHECKING_ALLOWANCE:
                checkAllowance()
                break
            case createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE:
                setAllowance()
                break
            case createFormStates.CREATE_FORM_STATE_WAITING_STREAM:
                createStream()
                break
            case createFormStates.CREATE_FORM_STATE_FINISHED:
            case createFormStates.CREATE_FORM_STATE_ERROR:
                break
            default:
                console.log(`Unhandled state ${formState}`)
        }
    }, [formState])

    const onRetry = () => {
        // Set initial state to restart stream creation process
        setFormState(createFormStates.CREATE_FORM_STATE_CHECKING_BALANCE)
    }

    const onCancel = () => {
        // close modal
    }

    return (
        <CreateForm
            formState={formState}
            retry={onRetry}
            streamId={streamId}
            error={error}
            cancel={cancel}
        />
    )
}

CreateFormContainer.propTypes = {
    amount: PropTypes.object.isRequired,
    tokenInstance: PropTypes.object.isRequired,
    web3: PropTypes.object.isRequired,
    sealedSablierInstance: PropTypes.object.isRequired,
    sender: PropTypes.string.isRequired,
    recipient: PropTypes.string.isRequired,
    duration: PropTypes.object.isRequired,
    cancel: PropTypes.func.isRequired,
}

export default CreateFormContainer