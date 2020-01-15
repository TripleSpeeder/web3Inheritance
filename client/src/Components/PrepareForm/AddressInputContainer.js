import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import AddressInput from './AddressInput'

export const addressInputStates = {
    ADDRESS_RESOLVING: 'address_resolving', // valid ENS name entered, waiting for resolving
    ADDRESS_VALID: 'address_valid', // got a valid address
    ADDRESS_INVALID: 'address_invalid',
}

const AddressInputContainer = ({setAddress, web3}) => {
    const [addressInputState, setAddressInputState] = useState(addressInputStates.ADDRESS_INVALID)
    const [input, setInput] = useState('')

    // verify address input
    useEffect(() => {
        const handleInput = async() => {
            // check for valid input (raw address and ENS name)
            const validAddress = (/^(0x)?[0-9a-f]{40}$/i.test(input))
            const validENSName = (/.*\.eth$/i.test(input))
            if (validENSName) {
                // resolve entered ENS name
                setAddressInputState(addressInputStates.ADDRESS_RESOLVING)
                try {
                    const resolvedAddress = await web3.eth.ens.getAddress(input)
                    console.log(`Resolved ${input} to ${resolvedAddress}`)
                    setAddressInputState(addressInputStates.ADDRESS_VALID)
                    setAddress(resolvedAddress)
                } catch (e) {
                    console.log("Could not resolve " + input)
                    setAddressInputState(addressInputStates.ADDRESS_INVALID)
                }
            }
            else if(validAddress) {
                setAddress(input)
                setAddressInputState(addressInputStates.ADDRESS_VALID)
            }
            else {
                setAddressInputState(addressInputStates.ADDRESS_INVALID)
            }
        }
        handleInput()
    }, [input, setAddress, web3])

    const error = (addressInputState === addressInputStates.ADDRESS_INVALID)
    const loading = (addressInputState === addressInputStates.ADDRESS_RESOLVING)
    const disabled = (error || loading)
    return (
        <AddressInput handleInput={setInput}
                      error = {error}
                      loading={loading}
                      disabled={disabled}
                      value={input}
        />
    )
}

AddressInputContainer.propTypes = {
    setAddress: PropTypes.func.isRequired,
    web3: PropTypes.object.isRequired,
};

export default AddressInputContainer
