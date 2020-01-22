import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {
    useParams
} from "react-router-dom";
import StreamDetails from './StreamDetails'
const contract = require("@truffle/contract");
const ERC20Data = require("../../contracts/ERC20Detailed")

StreamDetailsContainer.propTypes = {
    ERC1620Instance: PropTypes.object,
    web3: PropTypes.object,
}

function StreamDetailsContainer({ERC1620Instance, web3}) {
    const { streamId } = useParams();   // from react router
    const [loadingDetails, setLoadingDetails] = useState(true)
    const [streamDetails, setStreamDetails] = useState()
    const [withDrawing, setWithDrawing] = useState(false)
    const [account, setAccount] = useState('')
    const [token, setToken] = useState()

    useEffect(() => {
        const loadStreamDetails = async () => {
            setLoadingDetails(true)
            console.log(`Loading details for streamId ${streamId}...`)
            try {
                // Get account
                await window.ethereum.enable();
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0])

                // get streamDetails
                let streamDetails = await ERC1620Instance.getStream(streamId)
                console.log(streamDetails)

                // get token contract
                let erc20Contract = contract(ERC20Data)
                erc20Contract.setProvider(web3.currentProvider)
                let contractInstance = await erc20Contract.at(streamDetails.token)
                let name = await contractInstance.name()
                let symbol = await contractInstance.symbol()
                let decimals = await contractInstance.decimals()
                console.log(`Token: ${name} - ${symbol} - ${decimals.toString()}`)
                setToken({
                    name,
                    symbol,
                    decimals,
                    contractInstance,
                })

                // get recipient balance
                let recipientBalance = await ERC1620Instance.balanceOf(streamId, streamDetails.recipient)

                setStreamDetails({
                    recipient: streamDetails.recipient,
                    deposit: streamDetails.deposit,
                    tokenAddress: streamDetails.tokanAddress,
                    startTime: streamDetails.startTime,
                    stopTime: streamDetails.stopTime,
                    remainingBalance: streamDetails.remainingBalance,
                    ratePerSecond: streamDetails.ratePerSecond,
                    recipientBalance: recipientBalance
                })
            }catch (e) {
                console.log(`Failed to obtain stream details: ${e}`)
                setStreamDetails(undefined)
            }
            setLoadingDetails(false)
        }
        if (ERC1620Instance && streamId) {
            loadStreamDetails()
        }
    }, [streamId, ERC1620Instance, web3])


    const withdraw = async() => {
        console.log(`Withdrawing ${streamDetails.recipientBalance.toString()}`)
        setWithDrawing(true)
        try {
            let result = await ERC1620Instance.withdrawFromStream(streamId, streamDetails.recipientBalance.toString(), {from: account})
            console.log("Withdraw successfull!")
            console.log(result)
        } catch (e) {
            console.log("Error while withdrawing: ")
            console.log(e)
        }
        // reload stream details
        let nextStreamDetails = await ERC1620Instance.getStream(streamId)
        let recipientBalance = await ERC1620Instance.balanceOf(streamId, nextStreamDetails.recipient)
        setStreamDetails({
            recipient: nextStreamDetails.recipient,
            deposit: nextStreamDetails.deposit,
            tokenAddress: nextStreamDetails.tokanAddress,
            startTime: nextStreamDetails.startTime,
            stopTime: nextStreamDetails.stopTime,
            remainingBalance: nextStreamDetails.remainingBalance,
            ratePerSecond: nextStreamDetails.ratePerSecond,
            recipientBalance: recipientBalance
        })
        setWithDrawing(false)
    }

    return (
        <StreamDetails
            loading={loadingDetails}
            streamId={streamId}
            streamDetails={streamDetails}
            web3={web3}
            withdrawing={withDrawing}
            withdraw={withdraw}
            account={account}
            token={token}
        />
    )
}

export default StreamDetailsContainer