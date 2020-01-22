import React from 'react';
import { action } from '@storybook/addon-actions';
import {Button, Container, Modal} from 'semantic-ui-react'
import StreamProgress from './StreamProgress'
import dayjs from 'dayjs'

export default {
  title: 'StreamProgress',
  component: StreamProgress,
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

export const notStarted = () => {
    const day = 60 * 60 * 24
    // start in 3 days
    const startTimestamp = dayjs().unix()+3*day
    // stop after 3 weeks
    const stopTimestamp = startTimestamp + (21*day)

    return <StreamProgress
        startTimestamp = {startTimestamp}
        stopTimestamp = {stopTimestamp}
    />
}

export const active = () => {
    const day = 60 * 60 * 24
    // start 1 week ago
    const startTimestamp = dayjs().unix()-7*day
    // stop after 3 weeks
    const stopTimestamp = startTimestamp + (21*day)

    return <StreamProgress
        startTimestamp = {startTimestamp}
        stopTimestamp = {stopTimestamp}
    />
}

export const stopped = () => {
    const day = 60 * 60 * 24
    // start 2 weeks ago
    const startTimestamp = dayjs().unix() - 14 * day
    // stop 1 week after start
    const stopTimestamp = startTimestamp + (7 * day)

    return <StreamProgress
        startTimestamp={startTimestamp}
        stopTimestamp={stopTimestamp}
    />
}

