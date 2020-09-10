import React,{useState} from 'react';

import {Button, Dropdown, DropdownButton, Container} from 'react-bootstrap';

import './index.css';

function Header(props) {

  const handleShow = () => {
    props.changeModal(true)
  };
   
  return (
    <header className='header'>
        <Container>
            <a href="/" className="logo">Weather</a>
            <div className='header-actions'>
                <Button className="add-city-btn" variant="success" onClick={handleShow} >
                  Add city
                </Button>

                <DropdownButton variant="secondary" alignRight title="Settings" id="dropdown-menu-align-right">
                  <Dropdown.Header>Delete city</Dropdown.Header>
                  <Dropdown.Divider />
                  {props.cityList.map((city,i) =>{
                    return <Dropdown.Item onSelect={props.deleteCity} eventKey={i+1}>{city.name} &times;</Dropdown.Item>
                  })}
                </DropdownButton>
            </div>
        </Container>
    </header>
  );
}

export default Header;
