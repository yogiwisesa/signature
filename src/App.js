import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Toggle from 'react-toggle';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import SignatureCanvas from 'react-signature-canvas';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toggle/style.css"

function App() {
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [windowWidht, setWindowWidth] = useState();
  const [selectedOption, setSelectedOption] = useState([]);

  let signRef = useRef();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    setLoading(true);
    axios.get('https://run.mocky.io/v3/4dcd8453-10ee-4d0b-a8ce-91de693495e1')
      .then(res => {
        setData(res.data);
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false))

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
        {isLoading && <Spinner animation="border" />}
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
      <div className="footer">Hello, I'm the footer 😄</div>
    </>
  );
}

export default App;
