import React from 'react'
import PropTypes from 'prop-types'
import {Container, Image, Menu} from 'semantic-ui-react'

Header.propTypes = {
    
}

function Header(props) {

    return (
        <Container text>
            <Header as='h1' inverted style={{marginTop: '3em'}}>
                <Header.Content>Digital Heritage <em>powered by Sablier</em></Header.Content>
            </Header>
        </Container>
    )

    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item as='a' header>
                    Digital Heritage powered by Sablier
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default Header