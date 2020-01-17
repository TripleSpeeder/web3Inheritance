import React from 'react';
import { action } from '@storybook/addon-actions';
import CreateForm from './CreateForm'
import {Button, Container, Modal} from 'semantic-ui-react'
import {createFormStates} from './CreateFormContainer'

export default {
  title: 'CreateForm',
  component: CreateForm,
  decorators: [
    story => (
        <Container>
          <Modal
              defaultOpen={true}
          >
            <Modal.Header>
              Set up your heritage stream
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

export const balance_check = () => (
    <CreateForm
        retry={action('retry')}
        formState={createFormStates.CREATE_FORM_STATE_CHECKING_BALANCE} />
)

export const allowance_check = () => (
    <CreateForm
        retry={action('retry')}
        formState={createFormStates.CREATE_FORM_STATE_CHECKING_ALLOWANCE} />
)

export const allowance_wait = () => (
    <CreateForm
        retry={action('retry')}
        formState={createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE} />
)

export const stream_wait = () => (
    <CreateForm
        retry={action('retry')}
        formState={createFormStates.CREATE_FORM_STATE_WAITING_STREAM} />
)

export const finished = () => (
    <CreateForm
        retry={action('retry')}
        formState={createFormStates.CREATE_FORM_STATE_FINISHED}
        streamId={3521}
    />
)

export const error = () => (
    <CreateForm
        retry={action('retry')}
        formState={createFormStates.CREATE_FORM_STATE_CHECKING_BALANCE}
        streamId={3521}
        error={'Not enough funds. Required: 123.00 cDAI. Available: 0.00 cDAI.'}
    />
)
