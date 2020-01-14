import React from 'react'
import PropTypes from 'prop-types'
import {Container, Image, Menu} from 'semantic-ui-react'

Header.propTypes = {
    
}

function Header(props) {
    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item as='a' header>
                    Digital Heritage powered by Sablier
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default Header