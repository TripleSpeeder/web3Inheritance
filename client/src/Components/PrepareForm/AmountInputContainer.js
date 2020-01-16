import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {toBaseUnit} from '../../erc20-decimals-conversion'
import {Input, Form} from 'semantic-ui-react'
import bnToDisplayString from '@triplespeeder/bn2string'

/*
    Tasks for this component:
    - When user entered an amount, cross-check with erc20 contract if the current account
      has enough balance!
    - Convert user-friendly value provided through input component to raw token amount (decimals!)
    - Provide entered raw token amount to parent component through props.setAmount()
 */
const AmountInputContainer = ({web3, setAmount, token, account}) => {
    const [balance, setBalance] = useState({
        precise: '',
        rounded: '',
        amount:web3.utils.toBN(0)
    })
    const [loadingBalance, setLoadingBalance] = useState(true)

    // update balance when token contract changes
    useEffect(() => {
        const getBalance = async () => {
            setLoadingBalance(true)
            let balance = await token.contractInstance.balanceOf(account)
            let {precise, rounded} = bnToDisplayString({
                value: balance,
                decimals: token.decimals,
                roundToDecimals: web3.utils.toBN(3)
            })
            setBalance({precise, rounded, amount: balance})
            setLoadingBalance(false)
        }
        if (token && account) {
            getBalance()
        }
    }, [token, account])

    const onchange = (ev) => {
        let newValue = ev.target.value
        console.log(`New value from input: ${newValue}`)
        let amount = toBaseUnit(newValue, token.decimals, web3.utils.BN)
        console.log(`Converted ${newValue} to ${amount.toString()}`)
        setAmount(amount)
    }

    let balanceInfo
    if (!loadingBalance) {
        balanceInfo = <span>(Available: {balance.rounded} {token.symbol})</span>
    }

    return (
        <Form.Field>
            <label>How much do you want to stream? {balanceInfo}</label>
            <Input type='number' onChange={onchange}></Input>
        </Form.Field>
    )
}

AmountInputContainer.propTypes = {
    web3: PropTypes.object.isRequired,
    setAmount: PropTypes.func.isRequired,
    token: PropTypes.object,
    account: PropTypes.string.isRequired,
}

export default AmountInputContainer