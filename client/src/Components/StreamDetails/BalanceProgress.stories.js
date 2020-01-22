import React from 'react';
import { action } from '@storybook/addon-actions';
import {Button, Container, Modal} from 'semantic-ui-react'
import BalanceProgress from './BalanceProgress'
import BN from 'bn.js'

export default {
  title: 'BalanceProgress',
  component: BalanceProgress,
  decorators: [
    story => (
        <Container>
          <Modal
              defaultOpen={true}
          >
            <Modal.Header>
              Stream details
            </Modal.Header>
            <Modal.Content>
              {story()}
            </Modal.Content>
          </Modal>
        </Container>
    )
  ],
  parameters: []
};

const token = {
    symbol: 'DAI',
    decimals: new BN('3')
}

export const notStarted = () => {
    const deposit=new BN('5000000')
    const remainingBalance = deposit
    const recipientBalance = new BN('0')

    return <BalanceProgress
        BN={BN}
        deposit={deposit}
        recipientBalance={recipientBalance}
        remainingBalance={remainingBalance}
        token={token}
    />
}

export const activeNoWithdraw = () => {
    const deposit=new BN('5000000')
    const remainingBalance = deposit
    const recipientBalance = new BN('157345')

    return <BalanceProgress
        BN={BN}
        deposit={deposit}
        recipientBalance={recipientBalance}
        remainingBalance={remainingBalance}
        token={token}
    />
}

export const activePartialWithdraw = () => {
    const deposit=new BN('5000000')
    const remainingBalance = new BN('3200000')
    const recipientBalance = new BN('134772')

    return <BalanceProgress
        BN={BN}
        deposit={deposit}
        recipientBalance={recipientBalance}
        remainingBalance={remainingBalance}
        token={token}
    />
}
