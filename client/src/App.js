import React, {useEffect, useState} from 'react'
import getWeb3 from './getWeb3'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css'
import MainPage from './MainPage'
import {Container, Icon, List, Menu, Popup, Segment} from 'semantic-ui-react'
import StreamDetailsContainer from './Components/StreamDetails/StreamDetailsContainer'
import contract from '@truffle/contract'
import SealedSablierContractData from './contracts/SealedSablier'
import IERC1620ContractData from './contracts/IERC1620'
const loadTokens = require('./utils/contractLoader')

function App() {
  const [web3, setWeb3] = useState()
  const [sealedSablierContractInstance, setSealedSablierContractInstance] = useState()
  const [ERC1620ContractInstance, setERC1620ContractInstance] = useState()
  const [availableTokens, setAvailableTokens] = useState({})
  const [loadingWeb3, setLoadingWeb3] = useState(true)
  const [loadingTokens, setLoadingTokens] = useState(true)
  const [loadingSablier, setLoadingSablier] = useState(true)
  const [loadingERC1620, setLoadingERC1620] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoadingWeb3(true)
      try {
        setWeb3(await getWeb3())
        console.log("Got web3")
      } catch (e) {
        console.log(`Error getting web3:`)
        console.log(e)
        alert(
            `Failed to load web3. Check console for details.`,
        )
      }
      setLoadingWeb3(false)
    }
    run()
  }, [])

  useEffect(() => {
    const obtainTokenInstances = async() => {
      setLoadingTokens(true)
      setAvailableTokens(await loadTokens(web3))
      console.log("Got tokens")
      setLoadingTokens(false)
    }
    const obtainSealedSablierInstance = async () => {
      setLoadingSablier(true)
      const SealedSablierContract = contract(SealedSablierContractData)
      SealedSablierContract.setProvider(web3.currentProvider)
      try {
        setSealedSablierContractInstance(await SealedSablierContract.deployed())
        console.log("Got SealedSablier contract")
      }catch(error){
        console.log(error)
      }
      setLoadingSablier(false)
    }
    if (web3) {
      obtainTokenInstances()
      obtainSealedSablierInstance()
    }
  }, [web3])  // should actually depend on network(ID) instead of web3 obj

  useEffect(() => {
    const obtainERC1620 = async () => {
      setLoadingERC1620(true)
      const ERC1620Contract = contract(IERC1620ContractData)
      ERC1620Contract.setProvider(web3.currentProvider)
      try {
        setERC1620ContractInstance(await ERC1620Contract.at(await sealedSablierContractInstance.Sablier()))
        console.log("Got ERC1620 contract")
      }catch(error){
        console.log(error)
      }
      setLoadingERC1620(false)
    }
    if (sealedSablierContractInstance) {
      obtainERC1620()
    }
  }, [sealedSablierContractInstance, web3])

  return (
      <Router>

        <Segment inverted textAlign={'center'} vertical>
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Item header>
                Digital Heritage powered by &nbsp;<a href={'https://sablier.finance'}>Sablier</a>
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>

        <Switch>

          <Route path="/streams/:streamId">
            <Segment style={{padding: '8em 0em'}} vertical>
              <StreamDetailsContainer
                  ERC1620Instance={ERC1620ContractInstance}
                  web3={web3}
              />
            </Segment>
          </Route>

          <Route path="/incoming">
            <p>List incoming streams for current account here...</p>
          </Route>

          <Route path="/">
            <MainPage
                web3={web3}
                sealedSablierContractInstance={sealedSablierContractInstance}
                ERC1620ContractInstance={ERC1620ContractInstance}
                availableTokens={availableTokens}
            />
          </Route>

        </Switch>

        <Segment basic>
          <Container textAlign={'center'}>
            <List horizontal size={'huge'}>
              <List.Item as={'a'} href={'https://github.com/TripleSpeeder/web3Inheritance'} target={'_blank'}>
                <Popup content='github.com/TripleSpeeder/web3Inheritance' trigger={<Icon name={'github'}/>}/>
              </List.Item>
              <List.Item as={'a'} href={'mailto:michael@m-bauer.org'}>
                <Popup content='michael@m-bauer.org' trigger={<Icon name={'mail outline'}/>}/>
              </List.Item>
            </List>
          </Container>
        </Segment>

      </Router>
  )
}

export default App
