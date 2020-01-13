import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {toBaseUnit} from '../../erc20-decimals-conversion'

/*
    Tasks for this component:
    - When user entered an amount, cross-check with erc20 contract if the current account
      has enough balance!
    - Convert user-friendly value provided through input component to raw token amount (decimals!)
    - Provide entered raw token amount to parent component through props.setAmount()
    - Convert raw token amount to user-friendly string for rendering back in input component
 */
const AmountInputContainer = ({web3, setAmount, decimals}) => {
    const [localAmount, setLocalAmount] = useState('0')

    useEffect(() => {
        let amount = toBaseUnit(localAmount, decimals, web3.utils.BN)
        console.log(`Converted ${localAmount} to ${amount.toString()}`)
        setAmount(amount)
    }, [localAmount, decimals])

    const onchange = (ev) => {
        let newValue = ev.target.value
        console.log(`New value from input: ${newValue}`)
        setLocalAmount(ev.target.value)
    }

    return (
        <div>
            <input type='number' value={localAmount} onChange={onchange}></input>
        </div>
    )
}

AmountInputContainer.propTypes = {
    web3: PropTypes.object.isRequired,
    setAmount: PropTypes.func.isRequired,
    decimals: PropTypes.object.isRequired, // BN instance
}

export default AmountInputContainer