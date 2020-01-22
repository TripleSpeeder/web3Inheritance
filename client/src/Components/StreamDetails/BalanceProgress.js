import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {Progress} from 'semantic-ui-react'
import bnToDisplayString from '@triplespeeder/bn2string'
dayjs.extend(relativeTime)

BalanceProgress.propTypes = {
    BN: PropTypes.func.isRequired,
    deposit: PropTypes.object.isRequired,
    remainingBalance: PropTypes.object.isRequired,
    recipientBalance: PropTypes.object.isRequired,
    token: PropTypes.object.isRequired,
}

function BalanceProgress({BN, deposit, remainingBalance, recipientBalance, token}) {
    let balancePercent
    let withDrawnAmount = deposit.sub(remainingBalance)
    if (withDrawnAmount.isZero()) {
        balancePercent = new BN(0)
    } else if (withDrawnAmount.eq(deposit)) {
        balancePercent = new BN(100)
    } else {
        balancePercent = withDrawnAmount.muln(100).div(deposit)
    }

    const remainingBalanceDisplay = bnToDisplayString({
        value: remainingBalance,
        decimals: token.decimals,
        roundToDecimals: new BN(2)
    })
    const lockedBalanceDisplay = bnToDisplayString({
        value: remainingBalance.sub(recipientBalance),
        decimals: token.decimals,
        roundToDecimals: new BN(2)
    })
    const recipientBalanceDisplay = bnToDisplayString({
        value: recipientBalance,
        decimals: token.decimals,
        roundToDecimals: new BN(2)
    })
    let description = `${recipientBalanceDisplay.rounded} ${token.symbol} available for withdraw, ${lockedBalanceDisplay.rounded} ${token.symbol} pending`

    return (
        <Progress size={'big'} percent={balancePercent.toNumber()} progress color={'blue'}>
            {description}
        </Progress>    )

    /*
    // calculate balance progress (How many funds are already *withdrawn* vs total deposit)
    let withDrawnAmount = deposit.sub(remainingBalance)
    let balancePercent
    if (withDrawnAmount.isZero()) {
        balancePercent = web3.utils.toBN(0)
    } else if (withDrawnAmount.eq(deposit)) {
        balancePercent = web3.utils.toBN(100)
    } else {
        balancePercent = withDrawnAmount.muln(100).div(deposit)
    }
    console.log(balancePercent)
    console.log(`Deposit: ${deposit.toString()}, Withdrawn: ${withDrawnAmount.toString()} (${balancePercent.toString()}%)`)
*/
}

export default BalanceProgress