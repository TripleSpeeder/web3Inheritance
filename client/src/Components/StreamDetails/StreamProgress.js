import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {Progress} from 'semantic-ui-react'
dayjs.extend(relativeTime)

StreamProgress.propTypes = {
    startTimestamp: PropTypes.number.isRequired,
    stopTimestamp: PropTypes.number.isRequired,
}

function StreamProgress({startTimestamp, stopTimestamp}) {
    let startTime = dayjs.unix(startTimestamp)
    let stopTime = dayjs.unix(stopTimestamp)
    let now = dayjs()
    let durationSeconds = stopTimestamp - startTimestamp
    let started = startTime.isBefore(now)
    let stopped = stopTime.isBefore(now)
    let active = (started && (!stopped))
    let progressPercent
    let timeFormat = 'YYYY-MM-DD HH:mm'

    let description
    if (!started) {
        description = `Stream will start ${startTime.format(timeFormat)}`
        progressPercent = 0
    }else if (stopped) {
        description = `Stream has ended ${stopTime.format(timeFormat)}`
        progressPercent = 100
    } else if (active) {
        description = `Stream will end in ${now.to(stopTime)}`
        let elapsedSeconds = now.unix() - startTimestamp
        progressPercent = Math.round(elapsedSeconds*100/(durationSeconds))
    }

    return (
        <Progress
            size={'big'}
            percent={progressPercent}
            progress
            active={active}
            color={'teal'}
        >
            {description}
        </Progress>
    )
}

export default StreamProgress