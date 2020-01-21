import React from 'react'
import PropTypes from 'prop-types'
import {Button, Grid, Icon, Message, Segment, Step} from 'semantic-ui-react'
import {createFormStates} from './CreateFormContainer'

CreateForm.propTypes = {
    formState: PropTypes.number.isRequired,
    streamId: PropTypes.number,
    retry: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    error: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
}

function CreateForm({formState, streamId, retry, cancel, closeModal, error}) {

    let message
    if (formState === createFormStates.CREATE_FORM_STATE_FINISHED) {
        let streamLabel = 'app.sablier.finance/stream/'+streamId
        let streamUrl = 'https://'+streamLabel
        message = <Message success size={'big'}>
            <Message.Content>
                <Message.Header>Complete</Message.Header>
                <p>Your heritage stream is now created.</p>
                <p>The streamID is <em>{streamId}.</em></p>
                <Button as={'Link'} to={'/streams/${streamId}'} positive size={'big'}>View stream</Button>
            </Message.Content>
        </Message>
    } else if (error) {
        message = <Message icon error size={'big'}>
            <Icon name='exclamation'/>
            <Message.Content>
                <Message.Header>An error occured</Message.Header>
                <p>{error}</p>
                <Button.Group fluid size={'big'}>
                    <Button positive onClick={retry}>Retry</Button>
                    <Button.Or />
                    <Button negative onClick={cancel}>Cancel</Button>
                </Button.Group>
            </Message.Content>
        </Message>
    } else if (formState === createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE) {
        message = <Message icon info size={'big'}>
            <Icon name='info'/>
            <Message.Content>
                <Message.Header>Waiting for approval</Message.Header>
                Please approve transaction
            </Message.Content>
        </Message>
    }
    else {
        message = <Message icon info size={'big'}>
            <Icon name='info'/>
            <Message.Content>
                <Message.Header>Just one second</Message.Header>
                Setting up stream...
            </Message.Content>
        </Message>
    }
    return (
        <Grid columns={2}>
            <Grid.Row>
                <Grid.Column>
                    <Step.Group vertical fluid size='big'>
                        <Step
                            active={formState === createFormStates.CREATE_FORM_STATE_CHECKING_BALANCE}
                            completed={formState > createFormStates.CREATE_FORM_STATE_CHECKING_BALANCE}
                        >
                            <Icon name='dollar'/>
                            <Step.Content>
                                <Step.Title>Balance</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step
                            active={
                                (formState === createFormStates.CREATE_FORM_STATE_CHECKING_ALLOWANCE)||
                                (formState === createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE)
                            }
                            completed={formState > createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE}
                        >
                            <Icon name={(formState === createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE)?
                                'spinner loading':'ethereum'}
                            />
                            <Step.Content>
                                <Step.Title>Allowance</Step.Title>
                                {(formState === createFormStates.CREATE_FORM_STATE_WAITING_ALLOWANCE)&&
                                <Step.Description>Waiting for transaction to complete...</Step.Description>}
                            </Step.Content>
                        </Step>
                        <Step
                            active={formState === createFormStates.CREATE_FORM_STATE_WAITING_STREAM}
                            completed={formState > createFormStates.CREATE_FORM_STATE_WAITING_STREAM}
                        >
                            <Icon name={(formState === createFormStates.CREATE_FORM_STATE_WAITING_STREAM)?
                                'spinner loading':'ethereum'
                            }/>
                            <Step.Content>
                                <Step.Title>Stream creation</Step.Title>
                                {(formState === createFormStates.CREATE_FORM_STATE_WAITING_STREAM) &&
                                <Step.Description>Waiting for transaction to complete...</Step.Description>}
                            </Step.Content>
                        </Step>
                    </Step.Group>
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                    <Segment basic>
                        {message}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default CreateForm