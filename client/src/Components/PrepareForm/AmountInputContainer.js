import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {toBaseUnit} from '../../erc20-decimals-conversion'
import {Input} from 'semantic-ui-react'

/*
    Tasks for this component:
    - When user entered an amount, cross-check with erc20 contract if the current account
      has enough balance!
    - Convert user-friendly value provided through input component to raw token amount (decimals!)
    - Provide entered raw token amount to parent component through props.setAmount()
 */
const AmountInputContainer = ({web3, setAmount, decimals}) => {

    const onchange = (ev) => {
        let newValue = ev.target.value
        console.log(`New value from input: ${newValue}`)
        let amount = toBaseUnit(newValue, decimals, web3.utils.BN)
        console.log(`Converted ${newValue} to ${amount.toString()}`)
        setAmount(amount)
    }

    return (
        <div>
            <Input type='number' onChange={onchange}></Input>
        </div>
    )
}

AmountInputContainer.propTypes = {
    web3: PropTypes.object.isRequired,
    setAmount: PropTypes.func.isRequired,
    decimals: PropTypes.object.isRequired, // BN instance
}

export default AmountInputContainer