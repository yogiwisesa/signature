import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import Toggle from 'react-toggle'
import SignatureCanvas from 'react-signature-canvas'

import axios from 'axios';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toggle/style.css" // for ES6 modules
function App() {
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [windowWidht, setWindowWidth] = useState();
  let signRef = useRef();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios.get('https://run.mocky.io/v3/4dcd8453-10ee-4d0b-a8ce-91de693495e1')
      .then(res => {
        setData(res.data)
      })
      .catch(error => console.log(error))

    handleWindowWidth();
    window.addEventListener('resize', handleWindowWidth);
  }, [])

  const handleWindowWidth = () => {
    setWindowWidth(document.getElementById('navbar').offsetWidth)
  }
  const handleSubmit = () => {
    alert('Check console to see the data that will be submited!')
    console.log('--------------------------------------')
    console.log('Selected option', selectedOption)
    console.log('Signature Base64:')
    console.log(signRef.toDataURL())
    console.log('--------------------------------------')
  }

  if (!data) return <p>Loading</p>
  return (
    <>
      <Container className="App">
        <Nav
          id="navbar"
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <p>Your Logo Here</p>

          <span>
            <p>{data.header?.customerEmail}</p>
          </span>
        </Nav>

        <p>{data.body?.title}</p>
        <p>{data.body?.abstract}</p>
        <Button className="show-more-button" onClick={handleShow}>Show More</Button>

        {data.body?.options.map(item => {
          return (
            <Card key={item.title}>
              <Card.Body>
                <span>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>
                    {item.subtitle}
                  </Card.Text>
                </span>

                <span>
                  <Toggle
                    onChange={(e) => {
                      if (selectedOption.includes(item.title)) {
                        const newSelectedOption = selectedOption.filter(selected => selected !== item.title);
                        setSelectedOption(newSelectedOption)
                      } else {
                        setSelectedOption([...selectedOption, item.title])
                      }
                    }}
                  />
                </span>
              </Card.Body>
            </Card>
          )
        })}

        <p>Please sign down here:</p>
        <SignatureCanvas
          ref={ref => { signRef = ref }}
          penColor='green'
          canvasProps={{ width: windowWidht, height: 200, className: 'sigCanvas' }} />

        <Button onClick={handleSubmit}>Submit!</Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>This is the long text</Modal.Title>
          </Modal.Header>
          <Modal.Body>{data.body?.longText}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          </Modal.Footer>
        </Modal>

      </Container>
      <div className="footer">Hello, I'm the footer </div>
    </>
  );
}

export default App;
